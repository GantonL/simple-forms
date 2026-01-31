<script lang="ts">
	import * as Breadcrumb from '../ui/breadcrumb';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';

	let { items }: { items: BreadcrumbItemConfiguration[] } = $props();
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each items as item, index (item)}
			{@const isLast = index === items.length - 1}
			<Breadcrumb.Item>
				{@render AppBreadcrumbItem(item, isLast)}
			</Breadcrumb.Item>
			{#if !isLast}
				<Breadcrumb.Separator class={$direction === 'rl' ? 'translate rotate-180' : ''} />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>

{#snippet AppBreadcrumbItem(item: BreadcrumbItemConfiguration, isLast: boolean)}
	{#if isLast}
		<Breadcrumb.Page>{@render AppBreadcrumbItemLabel(item)}</Breadcrumb.Page>
	{:else}
		<Breadcrumb.Link href={item.link}>{@render AppBreadcrumbItemLabel(item)}</Breadcrumb.Link>
	{/if}
{/snippet}

{#snippet AppBreadcrumbItemLabel(item: BreadcrumbItemConfiguration)}
	{@const label = item.translateLabel === false ? item.label : $t(item.label)}
	<div class="flex flex-row items-center gap-2">
		{#if item.icon}
			<item.icon size={12} />
		{/if}
		<span class="max-w-32 min-w-0 truncate">{label}</span>
	</div>
{/snippet}
