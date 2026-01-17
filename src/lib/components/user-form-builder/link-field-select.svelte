<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Label } from '../ui/label';
	import { Info } from '@lucide/svelte';
	import * as Tooltip from '../ui/tooltip';

	type LinkFieldSelectProps = {
		fieldId: string;
		fieldType: string;
		schema: FormTemplateSchema;
		linkedFields?: Record<string, string>;
	};

	let { fieldId, fieldType, schema, linkedFields = $bindable({}) }: LinkFieldSelectProps = $props();

	const availableFields = $derived(
		schema.fields?.filter((f) => f.type === fieldType && f.id !== fieldId) ?? []
	);
</script>

{#if availableFields.length > 0}
	<div class="flex flex-col gap-2">
		<div class="flex flex-row items-center gap-2">
			<Label class="text-muted-foreground text-xs"
				>{$t('common.form_builder.auto_fill_from_another_field')}</Label
			>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Info size={12} />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{$t('common.form_builder.auto_fill_from_another_field_description')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Select.Root
			type="single"
			name={`linked-${fieldId}`}
			value={linkedFields[fieldId] || ''}
			onValueChange={(val) => {
				if (val) {
					linkedFields[fieldId] = val;
				} else {
					delete linkedFields[fieldId];
					linkedFields = linkedFields;
				}
			}}
		>
			<Select.Trigger class="h-8 w-[200px]">
				{#if linkedFields[fieldId]}
					{$t(availableFields.find((f) => f.id === linkedFields[fieldId])?.label || '')}
				{:else}
					<span class="text-muted-foreground">{$t('common.form_builder.select_field')}</span>
				{/if}
			</Select.Trigger>
			<Select.Content dir={$direction === 'lr' ? 'ltr' : 'rtl'}>
				<Select.Item value="">{$t('common.none')}</Select.Item>
				{#each availableFields as field (field.id)}
					{@const isCircular = linkedFields[field.id] === fieldId}
					<Tooltip.Root>
						<Tooltip.Trigger class="w-full">
							<Select.Item
								value={field.id}
								label={$t(field.label)}
								disabled={isCircular}
								class={isCircular ? "pointer-events-auto opacity-50" : ""}
							>
								{$t(field.label)}
							</Select.Item>
						</Tooltip.Trigger>
						{#if isCircular}
							<Tooltip.Content>
								<p>{$t('common.form_builder.circular_dependency_error')}</p>
							</Tooltip.Content>
						{/if}
					</Tooltip.Root>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
{/if}
