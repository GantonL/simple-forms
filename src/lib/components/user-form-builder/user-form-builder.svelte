<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from './field-renderer.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { t } from '$lib/i18n';
	import { onMount } from 'svelte';
	import EditableText from '../editable-text/editable-text.svelte';
	import CompiledMarkdown from '../resource-markdown/compiled-markdown.svelte';

	type UserFormBuilderProps = {
		schema: FormTemplateSchema;
		userData?: UserFormData;
	};

	let {
		schema,
		userData = $bindable({ editableTextBlocks: {}, fields: {} })
	}: UserFormBuilderProps = $props();

	// Initialize form state from schema
	onMount(() => {
		// Initialize editable text blocks with default content from schema
		if (schema.editableTextBlocks) {
			const initialTextBlocks: Record<string, string> = {};
			schema.editableTextBlocks.forEach((block) => {
				initialTextBlocks[block.id] = userData.editableTextBlocks[block.id] || t.get(block.content);
			});
			userData.editableTextBlocks = initialTextBlocks;
		}

		// Initialize fields with empty values
		if (schema.fields) {
			const initialFields: Record<string, string | number | boolean | string[]> = {};
			schema.fields.forEach((field) => {
				if (userData.fields[field.id] !== undefined) {
					initialFields[field.id] = userData.fields[field.id];
				} else if (field.type === 'number') {
					initialFields[field.id] = 0;
				} else {
					initialFields[field.id] = '';
				}
			});
			userData.fields = initialFields;
		}
	});
</script>

<div class="space-y-6">
	<!-- Editable Text Blocks Section -->
	{#if schema.editableTextBlocks && schema.editableTextBlocks.length > 0}
		<div class="space-y-4">
			<div>
				<h3 class="font-semibold">{$t('common.form_builder.editable_text_blocks')}</h3>
				<p class="text-muted-foreground text-sm">
					{$t('common.form_builder.editable_text_blocks_description')}
				</p>
			</div>
			<Separator />
			{#each schema.editableTextBlocks as block (block)}
				<div class="space-y-2">
					<Label for={block.id}>{$t(block.label)}</Label>
					<!-- <textarea
						id={block.id}
						bind:value={userData.editableTextBlocks[block.id]}
						placeholder={$t(block.label)}
						class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
					></textarea> -->
					<CompiledMarkdown content={userData.editableTextBlocks[block.id]}></CompiledMarkdown>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Form Fields Section -->
	{#if schema.fields && schema.fields.length > 0}
		<div class="space-y-4">
			<div>
				<h3 class="text-lg font-semibold">{$t('common.form_builder.form_fields')}</h3>
				<p class="text-muted-foreground text-sm">
					{$t('common.form_builder.form_fields_description')}
				</p>
			</div>
			<Separator />
			{#each schema.fields as field (field)}
				<FieldRenderer {field} bind:value={userData.fields[field.id]} />
			{/each}
		</div>
	{/if}
</div>
