<script lang="ts">
	import * as Sidebar from '../ui/sidebar';
	import Footer from './footer.svelte';
	import Header from './header.svelte';
	import AppSidebar from './sidebar/sidebar.svelte';
	import ScrollToTop from '../scroll-to-top/scroll-to-top.svelte';
	import { Elements } from '$lib/enums/elements';
	import { onDestroy, onMount } from 'svelte';
	import { shellContentScrollEvents, shellScrollContainer } from '$lib/stores';
	let { children } = $props();

	let scrollContainer: HTMLDivElement;
	let scrollEventTicking = false;

	onMount(() => {
		handleScrollEvents();
	});
	onDestroy(() => {
		scrollContainer?.removeEventListener('scroll', scrollEventListener);
	});

	function handleScrollEvents() {
		if (scrollContainer) {
			shellScrollContainer.set(scrollContainer);
			scrollContainer.addEventListener('scroll', function () {
				scrollEventListener();
			});
		}
	}

	function scrollEventListener() {
		if (!scrollEventTicking) {
			window.requestAnimationFrame(() => {
				shellContentScrollEvents.set({
					scrollTop: scrollContainer.scrollTop,
					clientHeight: scrollContainer.clientHeight,
					scrollHeight: scrollContainer.scrollHeight
				});
				scrollEventTicking = false;
			});
			scrollEventTicking = true;
		}
	}
</script>

<Sidebar.Provider>
	<AppSidebar />
	<div class="flex h-svh w-full flex-col overflow-hidden">
		<Header />
		<div
			id={Elements.ScrollableContent}
			class="relative flex grow flex-col overflow-x-hidden overflow-y-auto"
			bind:this={scrollContainer}
		>
			<main class="flex flex-auto grow flex-col items-center gap-8 p-4">
				{@render children?.()}
			</main>
			<Footer />
		</div>
		<ScrollToTop />
	</div>
</Sidebar.Provider>
