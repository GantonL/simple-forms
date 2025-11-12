<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from '$lib/components/user-form-builder/field-renderer.svelte';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import CompiledMarkdown from '../resource-markdown/compiled-markdown.svelte';

	type FormPreviewProps = {
		schema: FormTemplateSchema;
		userData: UserFormData;
		onSubmit?: (data?: string) => void;
		mode?: 'demo';
	};

	let { schema, userData, onSubmit, mode }: FormPreviewProps = $props();

	// Form container reference for PDF generation
	let formContainer: HTMLDivElement;
	let isGeneratingPdf = $state(false);
	let isFormValid = $state(false);

	// Parse section item to determine type
	type SectionItem = {
		type: 'text' | 'field';
		id: string;
		content?: string;
	};

	let html2canvas;
	let jsPDF;

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
		if (!formContainer || isGeneratingPdf || !html2canvas || !jsPDF) return;

		isGeneratingPdf = true;

		setTimeout(async () => {
			try {
				// Render the form container to canvas with html2canvas-pro (supports oklch)
				const canvas = await html2canvas(formContainer, {
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#ffffff'
				});

				// Get canvas dimensions
				const imgWidth = 210; // A4 width in mm
				const pageHeight = 297; // A4 height in mm
				const imgHeight = (canvas.height * imgWidth) / canvas.width;
				const margin = 5; // mm
				const availableWidth = imgWidth - 2 * margin;
				const availableHeight = pageHeight - 2 * margin;

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
					pdf.addImage(
						imgData,
						'JPEG',
						margin,
						margin,
						availableWidth,
						(canvas.height * availableWidth) / canvas.width
					);
				} else {
					// Multi-page
					let heightLeft = imgHeight;
					let position = 0;

					pdf.addImage(
						imgData,
						'JPEG',
						margin,
						margin,
						availableWidth,
						(canvas.height * availableWidth) / canvas.width
					);
					heightLeft -= availableHeight;

					while (heightLeft > 0) {
						position = heightLeft - imgHeight;
						pdf.addPage();
						pdf.addImage(
							imgData,
							'JPEG',
							margin,
							position + margin,
							availableWidth,
							(canvas.height * availableWidth) / canvas.width
						);
						heightLeft -= availableHeight;
					}
				}

				// Save PDF
				pdf.save('form.pdf');
				onSubmit?.();
			} catch (error) {
				console.error('Error generating PDF:', error);
			} finally {
				isGeneratingPdf = false;
			}
		});
	};
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
									<CompiledMarkdown content={parsedItem.content}></CompiledMarkdown>
								{/if}
							{:else if parsedItem.type === 'field'}
								<!-- Render actual input field -->
								{@const field = getField(parsedItem.id)}
								{#if field && userData.fields}
									{@const isDisabled = (): boolean => {
										const value = userData.fields![field.id];
										return (
											((typeof value === 'string' || Array.isArray(value)) && value.length > 0) ||
											typeof value === 'number' ||
											typeof value === 'boolean'
										);
									}}
									<div class="inline-block min-w-[200px] md:min-w-[250px] print:break-inside-avoid">
										<FieldRenderer
											{field}
											disabled={isDisabled()}
											bind:value={userData.fields[field.id]}
											onChange={handleFormInvalidation}
											mode={isGeneratingPdf ? 'display' : 'default'}
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
			onclick={generatePdf}
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
			color-adjust: exact;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
