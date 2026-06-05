<script lang="ts">
	import Avatar from '$lib/components/avatar/avatar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { t } from '$lib/i18n';
	import { sections } from './configurations';
	import { Label } from '../ui/label';
	import { defaultDateCell } from '../app-data-table/configurations/defaults';

	let { user } = $props();
</script>

<Card.Root class="w-full">
	<Card.Header class="flex flex-col items-center text-center">
		<Avatar styleClass="h-18 w-18" src={user.image} size={120} />
		<Card.Title class="mt-2 text-2xl">{user.name}</Card.Title>
		<Card.Description>{user.email}</Card.Description>
	</Card.Header>

	<Card.Content class="flex flex-col gap-8">
		<Separator />
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
				{@const value = user[item.key]}
				{#if value}
					<div class="flex flex-col gap-2">
						<Label class="flex flex-row items-center gap-2">
							{#if item.icon}
								<item.icon size={16} />
							{/if}
							<span>{$t(item.label)}</span>
						</Label>
						{#if item.type === 'text'}
							{value}
						{:else if item.type === 'date'}
							{defaultDateCell(value)}
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/snippet}
