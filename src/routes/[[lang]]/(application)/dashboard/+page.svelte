<script lang="ts">
	import { GET } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	async function testRemoteService() {
		const res = await GET<{ healthy: boolean }>('/api/remote/browser-service');
		if (res?.healthy) {
			toast.info('healthy');
		} else {
			toast.error('sick');
		}
	}
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<Button onclick={testRemoteService}>Test remote service</Button>
</BasePage>
