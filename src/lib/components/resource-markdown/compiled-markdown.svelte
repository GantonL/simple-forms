<script lang="ts">
	import { compile } from 'mdsvex';
	import MarkdownLayout from './markdown-layout.svelte';
	let { content }: { content: string } = $props();
	let compiledContent = $state();
	$effect.pre(() => {
		compile(content).then((compiled) => {
			compiledContent = compiled?.code;
		});
	});
</script>

<MarkdownLayout>
	{#if compiledContent}
		{@html compiledContent}
	{/if}
</MarkdownLayout>
