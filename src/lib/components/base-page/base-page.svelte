<script lang="ts">
	import { getTitleTemplate } from '$lib/client/configurations/meta-tags';
	import { locale, t } from '$lib/i18n';
	import type { BasePageProps } from '$lib/models/base-page';
	import { metaTags } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { MetaTagsProps } from 'svelte-meta-tags';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		header
	}: BasePageProps & { children?: Snippet; header?: Snippet } = $props();

	function setPageMetaTags() {
		const pageTitle = t.get(title);
		const pageDescription = t.get(description);
		const metaTagsObject = Object.freeze({
			title: pageTitle,
			titleTemplate: title !== 'common.brand.name' ? getTitleTemplate() : undefined,
			description: pageDescription,
			openGraph: {
				title: pageTitle,
				description: pageDescription
			}
		}) satisfies MetaTagsProps;
		metaTags.set(metaTagsObject);
	}

	onMount(() => {
		locale.subscribe(setPageMetaTags);
	});
</script>

<div class="min-h-svh w-full">
	{#if header}
		<div class="flex flex-col gap-2 pb-4">
			{@render header()}
		</div>
	{/if}
	{@render children?.()}
</div>
