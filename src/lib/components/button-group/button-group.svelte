<script lang="ts" generics="T = string">
	import { t } from '$lib/i18n';
	import type { ButtonGroupConfig } from '$lib/models/button-group';
	import { cn } from '$lib/utils';
	import Button from '../ui/button/button.svelte';

	type ButtonGroupProps = {
		config: ButtonGroupConfig<T>;
		activeValue: T;
	};

	let { config, activeValue = $bindable() }: ButtonGroupProps = $props();
</script>

<div class="inline-flex rounded-md shadow-sm" role="group">
	{#each config.items as item, index (item)}
		{@const isFirst = index === 0}
		{@const isLast = index === config.items.length - 1}
		{@const isActive = item.value === activeValue}
		{@const Icon = item.icon}
		<Button
			variant={isActive ? 'default' : 'outline'}
			onclick={() => (activeValue = item.value)}
			class={cn(isFirst && 'rounded-e-none', isLast && 'rounded-s-none')}
		>
			{#if Icon}
				<Icon class="size-4" />
			{/if}
			<span>{$t(item.label)}</span>
		</Button>
	{/each}
</div>
