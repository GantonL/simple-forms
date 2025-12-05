<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import SignaturePad from '$lib/components/signature-pad/signature-pad.svelte';
	import type { Field } from '$lib/models/form-temaplte-schema';
	import { t } from '$lib/i18n';

	type FieldRendererProps = {
		field: Field;
		value: string | number | boolean | string[] | undefined;
		mode?: 'default' | 'display' | 'build';
		onChange?: (newValue: FieldRendererProps['value']) => FieldRendererProps['value'];
	};

	let { field, value = $bindable(), mode = 'default', onChange }: FieldRendererProps = $props();
	const disabled = $derived(field.disabled && mode !== 'build');
</script>

<div class="space-y-2" class:opacity-70={disabled} class:pointer-events-none={disabled}>
	<Label for={field.id}>
		{$t(field.label)}
		{#if field.required && !field.disabled && mode === 'default'}
			<span class="text-destructive">*</span>
		{/if}
	</Label>

	{#if field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'tel'}
		{#if mode === 'default' || mode === 'build'}
			<Input
				id={field.id}
				type={field.type}
				bind:value
				{disabled}
				required={field.required}
				placeholder={$t(field.label)}
				onchange={() => onChange?.(value)}
			/>
		{:else if mode === 'display'}
			<span class="w-fit">{value}</span>
		{/if}
	{:else if field.type === 'textarea'}
		{#if mode === 'default' || mode === 'build'}
			<textarea
				id={field.id}
				bind:value
				{disabled}
				required={field.required}
				placeholder={$t(field.label)}
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				onchange={() => onChange?.(value)}
			></textarea>
		{:else if mode === 'display'}
			<span class="w-fit">{value}</span>
		{/if}
	{:else if field.type === 'date'}
		{#if mode === 'default' || mode === 'build'}
			<Input
				id={field.id}
				type="date"
				bind:value
				{disabled}
				required={field.required}
				class="w-36"
				onchange={() => onChange?.(value)}
			/>
		{:else if mode === 'display'}
			<span class="w-fit">{value}</span>
		{/if}
	{:else if field.type === 'signature'}
		<SignaturePad
			fieldId={field.id}
			bind:value={value as string | undefined}
			{disabled}
			required={field.required}
			onChange={() => onChange?.(value)}
			{mode}
		/>
	{/if}
</div>
