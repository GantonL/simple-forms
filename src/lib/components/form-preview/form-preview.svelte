<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from '$lib/components/user-form-builder/field-renderer.svelte';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { onMount, tick } from 'svelte';
	import CompiledMarkdown from '../resource-markdown/compiled-markdown.svelte';
	import { AppName } from '$lib/api/configurations/common';

	type FormPreviewProps = {
		schema: FormTemplateSchema;
		userData: UserFormData;
		onSubmit?: (file: File) => Promise<void>;
		mode?: 'demo';
	};

	let { schema, userData: initialUserData, onSubmit, mode }: FormPreviewProps = $props();

	// Form container reference for PDF generation
	let userData = $state(initialUserData);
	let formContainer: HTMLDivElement;
	let isGeneratingPdf = $state(false);
	let isFormValid = $state(false);
	let fieldRendererMode = $derived<'display' | 'default'>(isGeneratingPdf ? 'display' : 'default');

	// Parse section item to determine type
	type SectionItem = {
		type: 'text' | 'field';
		id: string;
		content?: string;
	};

	let html2canvas: any;
	let jsPDF: any;

	onMount(async () => {
		const [html2canvasModule, jsPDFModule] = await Promise.all([
			import('html2canvas-pro'),
			import('jspdf')
		]);
		html2canvas = html2canvasModule.default;
		jsPDF = jsPDFModule.jsPDF;
	});

	const parseSectionItem = (item: string): SectionItem | null => {
		// Check if it's a field reference (format: "fields:field_id")
		if (item.startsWith('fields:')) {
			const fieldId = item.substring(7); // Remove "fields:" prefix
			const field = schema.fields?.find((f) => f.id === fieldId);
			if (field) {
				return { type: 'field', id: fieldId };
			}
		} else {
			// It's a text block reference
			const textBlock = schema.editableTextBlocks?.find((block) => block.id === item);
			if (textBlock) {
				const content = userData.editableTextBlocks?.[item] || $t(textBlock.content);
				return { type: 'text', id: item, content };
			}
		}
		return null;
	};

	const getField = (fieldId: string) => {
		return schema.fields?.find((f) => f.id === fieldId);
	};

	const handleFormInvalidation = $derived(() => {
		if (!schema.fields || !userData.fields) return true;
		const allFieldsValid = schema.fields.every((field) => {
			if (!field.required) return true;

			const value = userData.fields?.[field.id];

			if (
				value === undefined ||
				value === null ||
				((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
			) {
				return false;
			}

			if (field.type === 'signature' && typeof value === 'string') {
				return value.startsWith('data:image');
			}

			return true;
		});

		isFormValid = allFieldsValid;
	});

	// Generate PDF from the form container
	const generatePdf = async () => {
		return new Promise((resolve, reject) => {
			if (!formContainer || !html2canvas || !jsPDF) resolve(undefined);
			setTimeout(async () => {
				try {
					// Prepare DOM for PDF generation (smart pagination)
					const { clone, cleanup } = await prepareDomForPdf(formContainer);

					try {
						// Render the form container to canvas with html2canvas-pro (supports oklch)
						const canvas = await html2canvas(clone, {
							scale: 2,
							useCORS: true,
							logging: false,
							backgroundColor: '#ffffff',
							windowWidth: formContainer.scrollWidth,
							windowHeight: clone.scrollHeight
						});

						// Get canvas dimensions
						const imgWidth = 210; // A4 width in mm
						const pageHeight = 297; // A4 height in mm
						const margin = 5; // mm
						const availableWidth = imgWidth - 2 * margin;
						const availableHeight = pageHeight - 2 * margin;
						const imgHeight = (canvas.height * availableWidth) / canvas.width;

						// Convert canvas to image
						const imgData = canvas.toDataURL('image/jpeg', 0.98);

						// Create PDF
						const pdf = new jsPDF({
							unit: 'mm',
							format: 'a4',
							orientation: 'portrait'
						});

						// Add image to PDF with margins
						if (imgHeight <= availableHeight) {
							// Single page
							pdf.addImage(imgData, 'JPEG', margin, margin, availableWidth, imgHeight);
						} else {
							// Multi-page PDF generation
							let position = 0;
							let heightLeft = imgHeight;

							// Add the first page
							pdf.addImage(imgData, 'JPEG', margin, margin, availableWidth, imgHeight);
							heightLeft -= availableHeight;
							position -= availableHeight;

							// Add subsequent pages as long as there is content left
							while (heightLeft > 0) {
								pdf.addPage();
								// The `position` is negative, which shifts the image upwards on the new page,
								// effectively showing the next slice of the content.
								pdf.addImage(imgData, 'JPEG', margin, position + margin, availableWidth, imgHeight);
								heightLeft -= availableHeight;
								position -= availableHeight;
							}
						}

						// Add header and footer to all pages
						const totalPages = pdf.getNumberOfPages();
						const dateStr = new Date().toLocaleDateString();

						for (let i = 1; i <= totalPages; i++) {
							pdf.setPage(i);
							pdf.setFont('NotoSans'); // Use Hebrew-supporting font
							pdf.setFontSize(10);
							pdf.setTextColor(150);

							// Add header (app name on the far end based on direction)
							const headerAlign = $direction === 'lr' ? 'right' : 'left';
							const headerX = $direction === 'lr' ? imgWidth - margin : margin;
							pdf.text(AppName, headerX, margin, { align: headerAlign });

							// Add footer (page number and date centered)
							const footerText = `${i} / ${totalPages} | ${dateStr}`;
							pdf.text(footerText, imgWidth / 2, pageHeight - 10, { align: 'center' });
						}

						resolve(pdf);
					} finally {
						cleanup();
					}
				} catch (error) {
					console.error('Error generating PDF:', error);
					reject(error);
				}
			});
		});
	};

	const prepareDomForPdf = async (sourceElement: HTMLElement) => {
		// Clone the element
		const clone = sourceElement.cloneNode(true) as HTMLElement;

		// Set styles to ensure it renders correctly but is hidden
		clone.style.position = 'absolute';
		clone.style.left = '-9999px';
		clone.style.top = '0';
		clone.style.width = `${sourceElement.offsetWidth}px`;
		clone.style.height = 'auto';
		clone.style.zIndex = '-1';
		// Ensure background is white
		clone.style.backgroundColor = '#ffffff';

		document.body.appendChild(clone);

		// Wait for render
		await tick();
		// Small delay to ensure layout is stable (sometimes images/fonts take a moment)
		await new Promise((r) => setTimeout(r, 100));

		// Calculate page height in pixels
		// A4: 210mm x 297mm
		// Margins: 5mm
		// Content area: 200mm x 287mm
		// Ratio: 287 / 200
		const contentWidth = clone.offsetWidth;
		const pageHeightPx = contentWidth * (287 / 200);

		// Process markdown containers: add data-pdf-item to individual elements
		const markdownContainers = clone.querySelectorAll('[data-pdf-markdown]');
		markdownContainers.forEach((container) => {
			// Find all block-level elements within markdown that should be atomic
			const blockElements = container.querySelectorAll(
				'p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre'
			);
			blockElements.forEach((el) => {
				(el as HTMLElement).setAttribute('data-pdf-item', 'true');
			});
		});

		// Find all atomic items
		const items = clone.querySelectorAll('[data-pdf-item]');

		let currentOffset = 0;

		// We need to iterate and insert spacers.
		// Note: inserting spacers changes the positions of subsequent items,
		// so we must re-measure or track the accumulated offset.
		// However, flex/grid layouts might behave complexly.
		// The safest way is to re-measure, but that's O(N^2).
		// Given N is small (number of fields), it's probably fine.
		// But let's try to be efficient: we only care about the top position relative to the container.

		// Actually, since we are modifying the DOM, `getBoundingClientRect` will update.
		// Let's iterate.
		for (let i = 0; i < items.length; i++) {
			const item = items[i] as HTMLElement;
			const rect = item.getBoundingClientRect();
			const containerRect = clone.getBoundingClientRect();

			const itemTop = rect.top - containerRect.top;
			const itemHeight = rect.height;
			const itemBottom = itemTop + itemHeight;

			// Check which page this item starts on
			const startPage = Math.floor(itemTop / pageHeightPx);
			// Check which page this item ends on
			const endPage = Math.floor(itemBottom / pageHeightPx);

			// If it crosses a page boundary
			if (startPage !== endPage) {
				// Calculate how much space we need to push it to the next page
				const nextPageStart = (startPage + 1) * pageHeightPx;
				const spacerHeight = nextPageStart - itemTop;

				// Create spacer
				const spacer = document.createElement('div');
				spacer.style.height = `${spacerHeight}px`;
				spacer.style.width = '100%';
				spacer.style.display = 'block';
				spacer.setAttribute('data-pdf-spacer', 'true');

				// Insert before item
				// Note: item.parentNode should be the flex container
				if (item.parentNode) {
					item.parentNode.insertBefore(spacer, item);
				}
			}
		}

		return {
			clone,
			cleanup: () => {
				document.body.removeChild(clone);
			}
		};
	};

	async function handleSubmission() {
		isGeneratingPdf = true;
		await tick();
		const pdf = (await generatePdf()) as any;
		pdf.save('form.pdf');
		const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
		const pdfFile = new File([pdfBlob], 'form.pdf', {
			type: 'application/pdf',
			lastModified: new Date().getTime()
		});
		await onSubmit?.(pdfFile);
		isGeneratingPdf = false;
	}
</script>

<div
	bind:this={formContainer}
	class="mx-auto w-full max-w-4xl bg-white p-8 text-black print:p-0"
	style="direction: {$direction === 'lr' ? 'ltr' : 'rtl'}"
>
	<!-- Layout-based rendering -->
	{#if schema.layout?.sections && schema.layout.sections.length > 0}
		<div class="space-y-6">
			{#each schema.layout.sections as section, sectionIndex (sectionIndex)}
				<div class="flex flex-row flex-wrap items-start gap-2 space-y-4">
					{#each section as item, itemIndex (itemIndex)}
						{@const parsedItem = parseSectionItem(item)}
						{#if parsedItem}
							{#if parsedItem.type === 'text'}
								<!-- Render text content without label -->
								{#if parsedItem.content}
									<div data-pdf-markdown>
										<CompiledMarkdown content={parsedItem.content}></CompiledMarkdown>
									</div>
								{/if}
							{:else if parsedItem.type === 'field'}
								<!-- Render actual input field -->
								{@const field = getField(parsedItem.id)}
								{#if field && userData.fields}
									<div
										class="inline-block min-w-[200px] md:min-w-[250px] print:break-inside-avoid"
										data-pdf-item
									>
										<FieldRenderer
											{field}
											bind:value={userData.fields[field.id]}
											onChange={handleFormInvalidation}
											mode={fieldRendererMode}
										/>
									</div>
								{/if}
							{/if}
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Submit Button -->
{#if mode !== 'demo'}
	<div class="mx-auto flex w-full max-w-4xl justify-center pb-8">
		<Button
			onclick={handleSubmission}
			disabled={isGeneratingPdf || !isFormValid}
			size="lg"
			class="w-full"
		>
			{#if isGeneratingPdf}
				{$t('common.generating')}...
			{:else}
				{$t('common.submit')}
			{/if}
		</Button>
	</div>
{/if}

<style>
	@media print {
		* {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}
		p {
			page-break-inside: avoid;
		}
	}
</style>
