<script lang="ts">
	import { t } from '$lib/i18n';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import * as Select from '$lib/components/ui/select';
	import {
		type CanvasBlock,
		type FieldType,
		type TextBlockProperties,
		type FieldBlockProperties,
		type FieldTypeConfig,
		isTextBlock,
		isFieldBlock,
		FIELD_TYPES
	} from './types';

	type Props = {
		block: CanvasBlock;
		onChange: (block: CanvasBlock) => void;
	};

	let { block, onChange }: Props = $props();

	function updateTextProperty<K extends keyof TextBlockProperties>(
		key: K,
		value: TextBlockProperties[K]
	) {
		if (isTextBlock(block.properties)) {
			onChange({
				...block,
				properties: { ...block.properties, [key]: value }
			});
		}
	}

	function updateFieldProperty<K extends keyof FieldBlockProperties>(
		key: K,
		value: FieldBlockProperties[K]
	) {
		if (isFieldBlock(block.properties)) {
			onChange({
				...block,
				properties: { ...block.properties, [key]: value }
			});
		}
	}

	function getSelectedFieldType(): FieldTypeConfig | undefined {
		if (!isFieldBlock(block.properties)) return undefined;
		const props = block.properties;
		return FIELD_TYPES.find((ft: FieldTypeConfig) => ft.value === props.fieldType);
	}

	const selectedFieldType = $derived(getSelectedFieldType());
</script>

<div class="space-y-4">
	{#if isTextBlock(block.properties)}
		<!-- Text Block Properties -->
		<div class="space-y-2">
			<Label for="text-label">{$t('common.template_builder.block_label')}</Label>
			<Input
				id="text-label"
				value={block.properties.label}
				oninput={(e) => updateTextProperty('label', e.currentTarget.value)}
				placeholder={$t('common.template_builder.enter_label')}
			/>
		</div>

		<div class="space-y-2">
			<Label for="text-content">{$t('common.template_builder.content')}</Label>
			<textarea
				id="text-content"
				value={block.properties.content}
				oninput={(e) => updateTextProperty('content', e.currentTarget.value)}
				placeholder={$t('common.template_builder.enter_content')}
				rows={6}
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>
			<p class="text-muted-foreground text-xs">
				{$t('common.template_builder.markdown_supported')}
			</p>
		</div>
	{:else if isFieldBlock(block.properties)}
		<!-- Field Block Properties -->
		<div class="space-y-2">
			<Label for="field-label">{$t('common.template_builder.field_label')}</Label>
			<Input
				id="field-label"
				value={block.properties.label}
				oninput={(e) => updateFieldProperty('label', e.currentTarget.value)}
				placeholder={$t('common.template_builder.enter_field_label')}
			/>
		</div>

		<div class="space-y-2">
			<Label for="field-type">{$t('common.template_builder.field_type')}</Label>
			<Select.Root
				type="single"
				value={block.properties.fieldType}
				onValueChange={(v) => v && updateFieldProperty('fieldType', v as FieldType)}
			>
				<Select.Trigger id="field-type" class="w-full">
					{selectedFieldType ? $t(selectedFieldType.labelKey) : $t('common.select_an_option')}
				</Select.Trigger>
				<Select.Content>
					{#each FIELD_TYPES as fieldType (fieldType.value)}
						<Select.Item value={fieldType.value} label={$t(fieldType.labelKey)}>
							{$t(fieldType.labelKey)}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="space-y-2">
			<Label for="field-placeholder">{$t('common.template_builder.placeholder')}</Label>
			<Input
				id="field-placeholder"
				value={block.properties.placeholder ?? ''}
				oninput={(e) => updateFieldProperty('placeholder', e.currentTarget.value)}
				placeholder={$t('common.template_builder.enter_placeholder')}
			/>
		</div>

		<div class="flex items-center justify-between rounded-lg border p-3">
			<div>
				<Label for="field-required" class="cursor-pointer">
					{$t('common.template_builder.required')}
				</Label>
				<p class="text-muted-foreground text-xs">
					{$t('common.template_builder.required_description')}
				</p>
			</div>
			<Switch
				id="field-required"
				checked={block.properties.required}
				onCheckedChange={(checked) => updateFieldProperty('required', checked)}
			/>
		</div>

		<div class="flex items-center justify-between rounded-lg border p-3">
			<div>
				<Label for="field-disabled" class="cursor-pointer">
					{$t('common.template_builder.disabled')}
				</Label>
				<p class="text-muted-foreground text-xs">
					{$t('common.template_builder.disabled_description')}
				</p>
			</div>
			<Switch
				id="field-disabled"
				checked={block.properties.disabled}
				onCheckedChange={(checked) => updateFieldProperty('disabled', checked)}
			/>
		</div>
	{/if}
</div>
