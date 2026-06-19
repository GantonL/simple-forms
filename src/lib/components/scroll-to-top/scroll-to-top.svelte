<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { t } from '$lib/i18n';
	import { direction, shellContentScrollEvents, shellScrollContainer } from '$lib/stores';
	import { ChevronUp } from '@lucide/svelte';
	import { afterNavigate } from '$app/navigation';

	let showButton = $state(false);
	let shellContainerRef: HTMLDivElement;

	afterNavigate(() => {
		scrollToTop();
	});

	shellContentScrollEvents.subscribe((scrollEvent) => {
		const scrollTop = scrollEvent?.scrollTop ?? 0;
		showButton = scrollTop > 200;
	});
	shellScrollContainer.subscribe((element) => {
		if (element) shellContainerRef = element;
	});

	function scrollToTop() {
		shellContainerRef?.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

{#if showButton}
	<Button
		variant="outline"
		size="icon"
		class="fixed bottom-6 z-50 rounded-full shadow-lg backdrop-blur-xs transition-all duration-300 hover:shadow-xl {$direction ===
		'lr'
			? 'right-6'
			: 'left-6'}"
		onclick={scrollToTop}
		aria-label={$t('common.scroll_to_top')}
	>
		<ChevronUp size={16} />
	</Button>
{/if}
