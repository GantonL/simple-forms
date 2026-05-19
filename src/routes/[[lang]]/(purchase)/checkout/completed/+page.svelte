<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { type AlertVariant } from '$lib/components/ui/alert';
	import * as Alert from '$lib/components/ui/alert';
	import { t } from '$lib/i18n';
	import { LoaderCircle, ShieldX, type IconProps } from '@lucide/svelte';
	import type { Component } from 'svelte';

	let { validation } = page.data;
	$effect(() => {
		validation.then((res: boolean) => {
			if (res) {
				goto(resolve('/'));
			}
		});
	});
</script>

<BasePage title="common.checkout_completed" description="seo.pages.checkout_completed.description">
	<div class="flex items-center justify-center">
		{#await validation}
			{@render validating()}
		{:then result}
			{#if !result}
				{@render error()}
			{/if}
		{:catch error}
			{@render error()}
		{/await}
	</div>
</BasePage>

{#snippet validating()}
	{@render alert({ icon: LoaderCircle, title: 'common.validating_checkout' })}
{/snippet}
{#snippet error()}
	{@render alert({
		variant: 'destructive',
		icon: ShieldX,
		title: 'common.checkout_validation_failed',
		description: 'common.checkout_validation_failed_description'
	})}
{/snippet}
{#snippet alert(options: {
	variant?: AlertVariant;
	icon: Component<IconProps>;
	title: string;
	description?: string;
})}
	<Alert.Root variant={options.variant ?? 'default'} class="w-fit">
		<Alert.Title class="flex flex-row items-center gap-2">
			<options.icon size={24} />
			<h2>{$t(options.title)}</h2>
		</Alert.Title>
		{#if options.description}
			<Alert.Description>
				{$t(options.description)}
			</Alert.Description>
		{/if}
	</Alert.Root>
{/snippet}
