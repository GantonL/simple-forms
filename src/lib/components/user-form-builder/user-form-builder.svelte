<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from './field-renderer.svelte';
	import { Label } from '$lib/components/ui/label';
	import { t } from '$lib/i18n';
	import { onMount } from 'svelte';
	import EditableText from '../editable-text/editable-text.svelte';
	import LinkFieldSelect from '$lib/components/user-form-builder/link-field-select.svelte';
	import { LINKABLE_FIELD_TYPES } from '$lib/constants/linking-config';
	import { getField, getTextBlock, parseSectionItem } from '../form-utils';

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
	{#if schema.layout?.sections && schema.layout.sections.length > 0}
		<div class="space-y-6">
			{#each schema.layout.sections as section, sectionIndex (sectionIndex)}
				<div class="flex flex-row flex-wrap items-start gap-2 space-y-4">
					{#each section as item, itemIndex (itemIndex)}
						{@const parsedItem = parseSectionItem(item, schema)}
						{#if parsedItem}
							{#if parsedItem.type === 'text'}
								{@const block = getTextBlock(parsedItem.id, schema)}
								{#if block}
									<div class="w-full space-y-2">
										<Label for={block.id}>{$t(block.label)}</Label>
										<EditableText
											id={block.id}
											bind:value={userData.editableTextBlocks![block.id]}
											placeholder={$t(block.label)}
										/>
									</div>
								{/if}
							{:else if parsedItem.type === 'field'}
								{@const field = getField(parsedItem.id, schema)}
								{#if field && userData.fields}
									{@const linkableField = LINKABLE_FIELD_TYPES.includes(field.type)}
									<div
										class="flex w-fit max-w-full flex-row flex-wrap items-center gap-2"
										class:border={linkableField}
										class:rounded-lg={linkableField}
										class:p-2={linkableField}
									>
										<FieldRenderer {field} bind:value={userData.fields[field.id]} mode="build" />

										{#if linkableField}
											<LinkFieldSelect
												fieldId={field.id}
												fieldType={field.type}
												{schema}
												bind:linkedFields={userData.linkedFields!}
											/>
										{/if}
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
