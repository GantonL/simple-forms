<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from './field-renderer.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { t } from '$lib/i18n';
	import { onMount } from 'svelte';
	import EditableText from '../editable-text/editable-text.svelte';
	import LinkFieldSelect from '$lib/components/user-form-builder/link-field-select.svelte';
	import { LINKABLE_FIELD_TYPES } from '$lib/constants/linking-config';

	type UserFormBuilderProps = {
		schema: FormTemplateSchema;
		userData?: UserFormData;
	};

	let {
		schema,
		userData = $bindable({ editableTextBlocks: {}, fields: {}, linkedFields: {} })
	}: UserFormBuilderProps = $props();

	$effect.pre(() => {
		if (!userData.linkedFields) {
			userData.linkedFields = {};
		}
	});
	onMount(() => {
		if (schema.editableTextBlocks) {
			const initialTextBlocks: Record<string, string> = {};
			schema.editableTextBlocks.forEach((block) => {
				initialTextBlocks[block.id] =
					userData.editableTextBlocks?.[block.id] || t.get(block.content);
			});
			userData.editableTextBlocks = initialTextBlocks;
		}

		if (schema.fields) {
			const initialFields: Record<string, string | number | boolean | string[]> = {};
			schema.fields.forEach((field) => {
				if (userData.fields?.[field.id] !== undefined) {
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
					<EditableText
						id={block.id}
						bind:value={userData.editableTextBlocks![block.id]}
						placeholder={$t(block.label)}
					/>
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
				{@const linkableField = LINKABLE_FIELD_TYPES.includes(field.type)}
				<div
					class="flex w-fit flex-row flex-wrap items-center gap-2"
					class:border={linkableField}
					class:rounded-lg={linkableField}
					class:p-2={linkableField}
				>
					<FieldRenderer {field} bind:value={userData.fields![field.id]} mode="build" />

					{#if linkableField}
						<LinkFieldSelect
							fieldId={field.id}
							fieldType={field.type}
							{schema}
							bind:linkedFields={userData.linkedFields!}
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
