<script lang="ts">
	import type { FormTemplateSchema, Field } from '$lib/models/form-temaplte-schema';

	type Props = {
		schema: FormTemplateSchema;
		class?: string;
	};

	type SectionItem = {
		type: 'text' | 'field';
		id: string;
		field?: Field;
	};

	const skeletonConfig = {
		title: 'bg-secondary/50 h-1 w-1/2 rounded-sm',
		signature: 'bg-secondary/50 h-4 w-4 rounded-sm shrink-0',
		text: 'bg-secondary/50 h-6 w-full rounded-sm',
		field: 'bg-secondary/50 h-1 w-3 rounded-sm'
	};

	let { schema, class: className = '' }: Props = $props();

	const parseSectionItem = (item: string): SectionItem | null => {
		if (item.startsWith('fields:')) {
			const fieldId = item.substring(7);
			const field = schema.fields?.find((f) => f.id === fieldId);
			if (field) return { type: 'field', id: fieldId, field };
		} else {
			const textBlock = schema.editableTextBlocks?.find((block) => block.id === item);
			if (textBlock) return { type: 'text', id: item };
		}
		return null;
	};

	const getItemClass = (item: SectionItem): string => {
		if (item.type === 'text') {
			if (item.id.toLowerCase().includes('title')) return skeletonConfig.title;
			return skeletonConfig.text;
		}
		if (item.field?.type === 'signature') return skeletonConfig.signature;
		
		return skeletonConfig.field;
	};

	const sections = $derived(schema.layout?.sections ?? []);
</script>

<div
	class="bg-card border-border relative aspect-[1/1.414] w-full overflow-y-auto rounded border shadow-sm {className}"
	dir={schema.direction === 'rtl' ? 'rtl' : 'ltr'}
>
	<div class="flex flex-col gap-2 p-4">
		{#each sections as section, sectionIndex (sectionIndex)}
			<div class="flex flex-wrap items-start gap-1">
				{#each section as item, itemIndex (itemIndex)}
					{@const parsed = parseSectionItem(item)}
					{#if parsed}
						<div class={getItemClass(parsed)}></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
