<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import SignaturePad from '$lib/components/signature-pad/signature-pad.svelte';
	import type { Field } from '$lib/models/form-temaplte-schema';
	import { t } from '$lib/i18n';

	type FieldRendererProps = {
		field: Field;
		value: string | number | boolean | string[] | undefined;
		onChange?: (newValue: FieldRendererProps['value']) => FieldRendererProps['value'];
	};

	let { field, value = $bindable(), onChange }: FieldRendererProps = $props();

	const isFilled = $derived(
		(typeof value === 'string' && value.length > 0) ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			(Array.isArray(value) && value.length > 0)
	);

	// Field is disabled if explicitly disabled OR if it has a filled value
	const isDisabled = $derived(field.disabled || isFilled);
</script>

<div class="space-y-2" class:opacity-70={isFilled} class:pointer-events-none={isFilled}>
	<Label for={field.id}>
		{$t(field.label)}
		{#if field.required && !isDisabled}
			<span class="text-destructive">*</span>
		{/if}
	</Label>

	{#if field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'tel'}
		<Input
			id={field.id}
			type={field.type}
			bind:value
			disabled={isDisabled}
			required={field.required}
			placeholder={$t(field.label)}
			onchange={() => onChange?.(value)}
		/>
	{:else if field.type === 'textarea'}
		<textarea
			id={field.id}
			bind:value
			disabled={isDisabled}
			required={field.required}
			placeholder={$t(field.label)}
			class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
			onchange={() => onChange?.(value)}
		></textarea>
	{:else if field.type === 'date'}
		<Input
			id={field.id}
			type="date"
			bind:value
			disabled={isDisabled}
			required={field.required}
			class="w-36"
			onchange={() => onChange?.(value)}
		/>
	{:else if field.type === 'signature'}
		<SignaturePad
			fieldId={field.id}
			bind:value={value as string | undefined}
			disabled={isDisabled}
			required={field.required}
			onChange={() => onChange?.(value)}
		/>
	{:else}
		<Input
			id={field.id}
			type="text"
			bind:value
			disabled={isDisabled}
			required={field.required}
			placeholder={$t(field.label)}
			onchange={() => onChange?.(value)}
		/>
	{/if}
</div>
