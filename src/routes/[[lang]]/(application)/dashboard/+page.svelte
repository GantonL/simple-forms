<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';

	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse = $state(
		page.data.remoteBrowserServiceLoadStatus
	);
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	{JSON.stringify(remoteBrowserServiceLoadStatus)}
</BasePage>
