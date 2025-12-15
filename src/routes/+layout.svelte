<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { locale } from '$lib/i18n';
	import type { AvailableLocals } from '$lib/enums/available-locales';
	import { direction, metaTags } from '$lib/stores';
	import { directionMap } from '$lib/api/configurations/common';
	import SEO from '$lib/components/seo/seo.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { deepMerge } from 'svelte-meta-tags';
	import { page } from '$app/state';

	let { children, data } = $props();
	let mergedMetaTags = $derived(
		deepMerge(data.baseMetaTags, deepMerge(page.data.pageMetaTags, $metaTags))
	);

	onMount(() => {
		locale.subscribe((seletedLocale) => {
			updateDirectionAndLang(seletedLocale as AvailableLocals);
		});
	});

	function updateDirectionAndLang(selectedLocale: AvailableLocals) {
		if (!selectedLocale) {
			return;
		}
		if (document) {
			const dir = directionMap[selectedLocale] ?? $direction;
			document.dir = dir === 'lr' ? 'ltr' : 'rtl';
			document.documentElement.lang = selectedLocale;
			direction.set(dir);
		}
	}
</script>

<Toaster expand={true} richColors={true} dir={$direction === 'lr' ? 'ltr' : 'rtl'} />
<SEO data={mergedMetaTags} />
<ModeWatcher defaultMode="light" />
{@render children?.()}
