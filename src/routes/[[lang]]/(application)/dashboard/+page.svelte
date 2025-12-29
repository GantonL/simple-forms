<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	async function testRemoteService() {
		const res = await fetch('http://remote-browser-service.railway.internal/health').catch((e) => {
			console.error(e);
			return;
		});
		console.log(res);
		if (res?.ok) {
			toast.info('healthy');
		} else {
			toast.error('sick');
		}
	}
</script>

<BasePage title="common.dashboard" description="seo.pages.dashboard.description">
	<Button onclick={testRemoteService}>Test remote service</Button>
</BasePage>
