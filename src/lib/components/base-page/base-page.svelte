<script lang="ts">
	import { getTitleTemplate } from '$lib/client/configurations/meta-tags';
	import { locale, t } from '$lib/i18n';
	import type { BasePageProps, ScrollLoader } from '$lib/models/base-page';
	import { metaTags, shellContentScrollEvents } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { MetaTagsProps } from 'svelte-meta-tags';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		header,
		dataLoader,
		onLoadMore,
		dataLoading,
		endOfData
	}: BasePageProps & { children?: Snippet; header?: Snippet } = $props();

	let lastScrollTop = 0;

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
	onDestroy(() => {});
	shellContentScrollEvents.subscribe(handleScrollEvents);

	function handleScrollEvents(scrollEvent: {
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
	}) {
		if (!dataLoader) return;
		if (!scrollEvent) return;
		if (endOfData) return;
		const currentScrollTop = scrollEvent.scrollTop;
		if (currentScrollTop < lastScrollTop) return;
		if (
			scrollEvent.scrollTop + scrollEvent.clientHeight >=
			scrollEvent.scrollHeight *
				((scrollEvent.scrollHeight * (dataLoader as ScrollLoader).threshold) /
					100 /
					scrollEvent.scrollHeight)
		) {
			if (dataLoading) return;
			onLoadMore?.();
		}
		lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
	}
</script>

<div class="min-h-svh w-full">
	{#if header}
		<div class="flex flex-col gap-2 pb-4">
			{@render header()}
		</div>
	{/if}
	{@render children?.()}
</div>
