<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from '$lib/components/user-form-builder/field-renderer.svelte';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas-pro';

	type FormPreviewProps = {
		schema: FormTemplateSchema;
		userData: UserFormData;
	};

	let { schema, userData }: FormPreviewProps = $props();

	// Form container reference for PDF generation
	let formContainer: HTMLDivElement;
	let isGeneratingPdf = $state(false);

	// Parse section item to determine type
	type SectionItem = {
		type: 'text' | 'field';
		id: string;
		content?: string;
	};

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

	// Get field definition by ID
	const getField = (fieldId: string) => {
		return schema.fields?.find((f) => f.id === fieldId);
	};

	// Validation logic - check if all required fields are filled
	const isFormValid = $derived(() => {
		if (!schema.fields || !userData.fields) return true;

		return schema.fields.every((field) => {
			if (!field.required) return true;

			const value = userData.fields?.[field.id];

			// Check if value exists and is not empty
			if (value === undefined || value === null || value === '') {
				return false;
			}

			// For signature fields, check if it's a valid data URL
			if (field.type === 'signature' && typeof value === 'string') {
				return value.startsWith('data:image');
			}

			return true;
		});
	});

	// Generate PDF from the form container
	const generatePdf = async () => {
		if (!formContainer || isGeneratingPdf) return;

		isGeneratingPdf = true;

		try {
			// html2canvas-pro has better CSS support including modern color formats
			const canvas = await html2canvas(formContainer, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: '#ffffff'
			});

			// Calculate PDF dimensions
			const imgWidth = 210; // A4 width in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			// Create PDF
			const pdf = new jsPDF({
				orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
				unit: 'mm',
				format: 'a4'
			});

			const imgData = canvas.toDataURL('image/png');
			pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

			pdf.save(`form.pdf`);
		} catch (error) {
			console.error('Error generating PDF:', error);
		} finally {
			isGeneratingPdf = false;
		}
	};
</script>

<div class="space-y-6">
	<div
		bind:this={formContainer}
		class="mx-auto w-full max-w-4xl bg-white p-8 text-black print:p-0"
		style="direction: {$direction === 'lr' ? 'ltr' : 'rtl'}"
	>
		<!-- Layout-based rendering -->
		{#if schema.layout?.sections && schema.layout.sections.length > 0}
			<div class="space-y-6">
				{#each schema.layout.sections as section, sectionIndex (sectionIndex)}
					{#if Array.isArray(section)}
						<!-- Section is an array of items (can be text or fields) -->
						<div class="space-y-4 print:break-inside-avoid">
							{#each section as item, itemIndex (itemIndex)}
								{@const parsedItem = parseSectionItem(item)}
								{#if parsedItem}
									{#if parsedItem.type === 'text'}
										<!-- Render text content without label -->
										<div class="prose prose-sm max-w-none whitespace-pre-wrap">
											{parsedItem.content}
										</div>
									{:else if parsedItem.type === 'field'}
										<!-- Render actual input field -->
										{@const field = getField(parsedItem.id)}
										{#if field && userData.fields}
											<div class="inline-block min-w-[200px] md:min-w-[250px]">
												<FieldRenderer {field} bind:value={userData.fields[field.id]} />
											</div>
										{/if}
									{/if}
								{/if}
							{/each}
						</div>
					{:else}
						<!-- Section is a single item -->
						{@const parsedItem = parseSectionItem(section)}
						{#if parsedItem}
							<div class="print:break-inside-avoid">
								{#if parsedItem.type === 'text'}
									<!-- Render text content without label -->
									<div class="prose prose-sm max-w-none whitespace-pre-wrap">
										{parsedItem.content}
									</div>
								{:else if parsedItem.type === 'field'}
									<!-- Render actual input field -->
									{@const field = getField(parsedItem.id)}
									{#if field && userData.fields}
										<FieldRenderer {field} bind:value={userData.fields[field.id]} />
									{/if}
								{/if}
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		{/if}

		<!-- Footer with preview info -->
		<div class="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500 print:break-inside-avoid">
			<p>{$t('common.form_builder.preview')} - {new Date().toLocaleDateString()}</p>
		</div>
	</div>

	<!-- Submit Button -->
	<div class="mx-auto flex w-full max-w-4xl justify-center pb-8">
		<Button onclick={generatePdf} disabled={isGeneratingPdf} size="lg" class="min-w-[200px]">
			{#if isGeneratingPdf}
				{$t('common.generating')}...
			{:else}
				{$t('common.submit')}
			{/if}
		</Button>
	</div>
</div>

<style>
	@media print {
		* {
			color-adjust: exact;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
