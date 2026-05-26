<script>
	import { pricingPlans } from '$lib/client/configurations/pricing';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import PricingSection from '$lib/components/pricing-section/pricing-section.svelte';
	import { onMount } from 'svelte';
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
</script>

<BasePage title="common.pricing" description="seo.pages.home.description">
	<PricingSection plans={pricingPlans} {mounted} />
</BasePage>
