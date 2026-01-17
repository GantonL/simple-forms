<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from './field-renderer.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { t } from '$lib/i18n';
	import { onMount } from 'svelte';
	import EditableText from '../editable-text/editable-text.svelte';
	import * as Select from '$lib/components/ui/select';

	type UserFormBuilderProps = {
		schema: FormTemplateSchema;
		userData?: UserFormData;
	};

	let {
		schema,
		userData = $bindable({ editableTextBlocks: {}, fields: {}, linkedFields: {} })
	}: UserFormBuilderProps = $props();

	const dateFields = $derived(schema.fields?.filter((f) => f.type === 'date') ?? []);

	// Initialize form state from schema
	onMount(() => {
		// Initialize editable text blocks with default content from schema
		if (schema.editableTextBlocks) {
			const initialTextBlocks: Record<string, string> = {};
			schema.editableTextBlocks.forEach((block) => {
				initialTextBlocks[block.id] =
					userData.editableTextBlocks?.[block.id] || t.get(block.content);
			});
			userData.editableTextBlocks = initialTextBlocks;
		}

		// Initialize fields with empty values
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

		// Initialize linked fields
		if (!userData.linkedFields) {
			userData.linkedFields = {};
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
				<div class="flex flex-row gap-2 items-center">
					<FieldRenderer {field} bind:value={userData.fields![field.id]} mode="build" />

					{#if field.type === 'date' && dateFields.length > 1}
						<div class="ml-4 max-w-sm">
							<Label class="text-muted-foreground text-xs"
								>{$t('common.form_builder.link_to_another_field')}</Label
							>
							<Select.Root
								type="single"
								name={`linked-${field.id}`}
								value={userData.linkedFields?.[field.id] || ''}
								onValueChange={(val) => {
									if (!userData.linkedFields) userData.linkedFields = {};
									if (val) {
										userData.linkedFields[field.id] = val;
									} else {
										delete userData.linkedFields[field.id];
									}
								}}
							>
								<Select.Trigger class="h-8 w-[200px]">
									{#if userData.linkedFields?.[field.id]}
										{$t(
											dateFields.find((f) => f.id === userData.linkedFields![field.id])?.label || ''
										)}
									{:else}
										<span class="text-muted-foreground"
											>{$t('common.form_builder.select_field_to_link')}</span
										>
									{/if}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="">{$t('common.none')}</Select.Item>
									{#each dateFields.filter((f) => f.id !== field.id) as dateField}
										<Select.Item value={dateField.id} label={$t(dateField.label)}
											>{$t(dateField.label)}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
