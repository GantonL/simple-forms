<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import TemplateBuilder from '$lib/components/template-builder/template-builder.svelte';
	import { t } from '$lib/i18n';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { POST } from '$lib/api/helpers/request';
	import { FormsTemplates } from '../../../../api';
	import type { Section } from '$lib/components/template-builder/types';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { resolve } from '$app/paths';
	import { direction } from '$lib/stores';

	let isSaving = false;
	let templateName = $state('');
	let templateDescription = $state('');

	async function handleSaveTemplate(sections: Section[]) {
		if (isSaving) return;
		if (!templateName.trim() || !templateDescription.trim()) {
			toast.error(
				$t('common.error_missing_fields') ||
					'Please provide a name and description for the template'
			);
			return;
		}

		isSaving = true;

		try {
			const editableTextBlocks: any[] = [];
			const fields: any[] = [];
			const layoutSections: string[][] = [];

			sections.forEach((section) => {
				const layoutRow: string[] = [];
				section.blocks.forEach((block) => {
					if (block.type === 'text') {
						const props = block.properties as any;
						editableTextBlocks.push({
							id: block.id,
							label: props.label || '',
							content: props.content || ''
						});
						layoutRow.push(block.id);
					} else if (block.type === 'field') {
						const props = block.properties as any;
						fields.push({
							id: block.id,
							label: props.label || '',
							type: props.fieldType || 'text',
							required: !!props.required,
							disabled: !!props.disabled
						});
						layoutRow.push(`fields:${block.id}`);
					}
				});
				if (layoutRow.length > 0) {
					layoutSections.push(layoutRow);
				}
			});

			const schema = {
				version: '1.0',
				direction: $direction === 'lr' ? 'ltr' : 'rtl',
				name: templateName,
				description: templateDescription,
				editableTextBlocks,
				fields,
				layout: { sections: layoutSections }
			};

			const response = await POST<any, { created: any }>(FormsTemplates, [
				{
					key: null,
					schema: schema,
					is_community: false
				}
			]);

			if (!response) {
				throw new Error('Failed to save template');
			}

			toast.success(t.get('common.success') || 'Template saved successfully');
			await goto(resolve('/templates')); // Redirect to templates list
		} catch (error) {
			console.error(error);
			toast.error(t.get('common.error') || 'An error occurred while saving the template');
		} finally {
			isSaving = false;
		}
	}
</script>

<BasePage title="common.create_template" description="common.create_templates_description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.create_template')}</h2>
		<p class="text-lg font-light">{$t('common.create_templates_description')}</p>
	{/snippet}

	<div class="mb-6 flex max-w-2xl flex-col gap-4">
		<div class="flex flex-col gap-2">
			<Label for="template-name">{$t('common.name')} *</Label>
			<Input
				id="template-name"
				bind:value={templateName}
				placeholder={$t('common.name') || 'Enter template name'}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<Label for="template-desc">{$t('common.description')} *</Label>
			<textarea
				id="template-desc"
				bind:value={templateDescription}
				placeholder={$t('common.description')}
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>
		</div>
	</div>

	<TemplateBuilder onSave={handleSaveTemplate} />
</BasePage>
