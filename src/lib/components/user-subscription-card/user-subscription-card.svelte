<script lang="ts">
	import { t } from '$lib/i18n';
	import type { Subscription } from '$lib/models/subscription';
	import { defaultDateCell } from '../app-data-table/configurations/defaults';
	import Link from '../link/link.svelte';
	import { Badge } from '../ui/badge';
	import * as Card from '../ui/card';
	import { Label } from '../ui/label';
	import Separator from '../ui/separator/separator.svelte';
	import { sections } from './configurations';

	let { subscription }: { subscription: Subscription } = $props();
</script>

<Card.Root class="w-full">
	<Card.Content class="flex flex-col gap-8">
		{#each sections as section, i (section)}
			{@render Section(section)}
			{#if i < sections.length - 1}
				<Separator />
			{/if}
		{/each}
	</Card.Content>
</Card.Root>

{#snippet Section(config: (typeof sections)[0])}
	<div class="flex flex-col gap-4">
		<h3 class="font-bold">{$t(config.title)}</h3>
		<div class="flex flex-row flex-wrap items-center justify-between gap-4">
			{#each config.items as item, i (item)}
				{#if !(item.hideIf && item.hideIf(subscription))}
					{@const rawValue = subscription[item.key]}
					{@const value = item.trasformValue ? item.trasformValue(rawValue) : rawValue}
					{#if value}
						<div class="flex flex-col gap-2 p-2 {item.class}">
							<Label class="flex flex-row items-center gap-2">
								{#if item.icon}
									<item.icon size={16} />
								{/if}
								<span>{$t(item.label)}</span>
								{#if item.link}
									<Link link={item.link} />
								{/if}
							</Label>
							{#if item.type === 'text'}
								{#if item.translateValue}
									{$t(value as string)}
								{:else}
									{value}
								{/if}
							{:else if item.type === 'date'}
								{defaultDateCell(value as Date)}
							{:else if item.type === 'badge'}
								<Badge>{$t(`common.plans.${value}.name`)}</Badge>
							{/if}
						</div>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
{/snippet}
