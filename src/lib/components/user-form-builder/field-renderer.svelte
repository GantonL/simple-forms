<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { Field } from '$lib/models/form-temaplte-schema';
	import { t } from '$lib/i18n';

	type FieldRendererProps = {
		field: Field;
		value: string | number | boolean | string[] | undefined;
	};

	let { field, value = $bindable() }: FieldRendererProps = $props();
</script>

<div class="space-y-2">
	<Label for={field.id}>
		{$t(field.label)}
		{#if field.required}
			<span class="text-destructive">*</span>
		{/if}
	</Label>

	{#if field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'tel'}
		<Input
			id={field.id}
			type={field.type}
			bind:value
			disabled={field.disabled}
			required={field.required}
			placeholder={$t(field.label)}
		/>
	{:else if field.type === 'textarea'}
		<textarea
			id={field.id}
			bind:value
			disabled={field.disabled}
			required={field.required}
			placeholder={$t(field.label)}
			class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
		></textarea>
	{:else if field.type === 'date'}
		<Input
			id={field.id}
			type="date"
			bind:value
			disabled={field.disabled}
			required={field.required}
		/>
	{:else}
		<Input
			id={field.id}
			type="text"
			bind:value
			disabled={field.disabled}
			required={field.required}
			placeholder={$t(field.label)}
		/>
	{/if}
</div>
