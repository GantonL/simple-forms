<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { RemoteBrwoserServiceLoadStatusResponse } from '$lib/types/remote-browser';
	import RemoteBrowserServiceLoadStatus from './components/remote-browser-service-load-status.svelte';

	let remoteBrowserServiceLoadStatus: RemoteBrwoserServiceLoadStatusResponse | undefined = $state(
		page.data.remoteBrowserServiceLoadStatus
	);
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<RemoteBrowserServiceLoadStatus data={remoteBrowserServiceLoadStatus} />
	</div>
</BasePage>
