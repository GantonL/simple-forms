<script lang="ts">
	import CompiledMarkdown from '../resource-markdown/compiled-markdown.svelte';
	import ButtonGroup from '$lib/components/button-group/button-group.svelte';
	import EditableTextToolbar from './editable-text-toolbar.svelte';
	import { ModeToggleConfiguration } from './configurations/mode-toggle';
	import { MarkdownToolbarConfiguration } from './configurations/markdown-toolbar';
	import { Card } from '../ui/card';
	import CardContent from '../ui/card/card-content.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import Separator from '../ui/separator/separator.svelte';

	let { id, value = $bindable(), placeholder } = $props();

	let mode = $state<'edit' | 'preview'>('edit');
	let textareaRef = $state<HTMLTextAreaElement>();
</script>

<Card class="gap-2 py-2">
	<CardHeader class="flex flex-row-reverse justify-between px-2">
		<ButtonGroup config={ModeToggleConfiguration} bind:activeValue={mode} />
		{#if mode === 'edit'}
			<EditableTextToolbar config={MarkdownToolbarConfiguration} textarea={textareaRef} />
		{/if}
	</CardHeader>
	<Separator></Separator>
	<CardContent class="px-2">
		{#if mode === 'edit'}
			<textarea
				{id}
				bind:this={textareaRef}
				bind:value
				{placeholder}
				class="border-input bg-muted/50 ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-b-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
			></textarea>
		{:else}
			<CompiledMarkdown content={value}></CompiledMarkdown>
		{/if}
	</CardContent>
</Card>
