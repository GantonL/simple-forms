<script lang="ts">
	import { locale } from '$lib/i18n';
	import { type Component } from 'svelte';
	import MarkdownLayout from './markdown-layout.svelte';
	let { path }: { path: string } = $props();
	let readyToRender = $state(false);
	let Content: Component | undefined = $state();

	$effect.pre(() => {
		setContent();
		locale.subscribe(setContent);
	});

	async function setContent() {
		if (path) {
			Content = (await import(`$lib/resources/markdown/${locale.get()}/${path}.md`)).default;
		}

		readyToRender = true;
	}
</script>

<MarkdownLayout>
	{#if readyToRender}
		<Content />
	{/if}
</MarkdownLayout>
