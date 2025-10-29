<script lang="ts">
	import type { MarkdownToolbarConfig } from '$lib/models/markdown-toolbar';
	import Button from '../ui/button/button.svelte';

	type EditableTextToolbarProps = {
		config: MarkdownToolbarConfig;
		textarea: HTMLTextAreaElement | undefined;
	};

	let { config, textarea }: EditableTextToolbarProps = $props();
</script>

<div class="border-input bg-muted/60 flex gap-1 rounded-t-md border border-b-0 p-1">
	{#each config.items as item (item)}
		{@const Icon = item.icon}
		<Button
			variant="outline"
			disabled={!textarea}
			onclick={() => textarea && item.action(textarea)}
			class="flex flex-row items-center gap-2"
		>
			<Icon class="size-4" />
		</Button>
	{/each}
</div>
