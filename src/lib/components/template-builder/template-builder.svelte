<script lang="ts">
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import BlockPalette from './block-palette.svelte';
	import BuilderCanvas from './builder-canvas.svelte';
	import BlockProperties from './block-properties.svelte';
	import type { CanvasBlock, Section, BlockType, FieldType } from './types';

	let sections = $state<Section[]>([]);
	let selectedBlockId = $state<string | null>(null);
	let draggedBlockType = $state<{ type: BlockType; fieldType?: FieldType } | null>(null);

	const selectedBlock = $derived(
		sections.flatMap((s) => s.blocks).find((b) => b.id === selectedBlockId) ?? null
	);

	function generateId(prefix: string = 'item'): string {
		return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	function handlePaletteDragStart(type: BlockType, fieldType?: FieldType) {
		draggedBlockType = { type, fieldType };
	}

	function handleCanvasDrop(sectionIndex: number, blockIndex?: number) {
		if (!draggedBlockType) return;

		const newBlock: CanvasBlock = {
			id: generateId('block'),
			type: draggedBlockType.type,
			properties:
				draggedBlockType.type === 'text'
					? { content: '', label: t.get('common.template_builder.new_text_block') }
					: {
							label: t.get('common.template_builder.new_field'),
							fieldType: draggedBlockType.fieldType ?? 'text',
							required: false,
							disabled: false
						}
		};

		sections = sections.map((section, idx) => {
			if (idx === sectionIndex) {
				const updatedBlocks = [...section.blocks];
				if (blockIndex !== undefined) {
					updatedBlocks.splice(blockIndex, 0, newBlock);
				} else {
					updatedBlocks.push(newBlock);
				}
				return { ...section, blocks: updatedBlocks };
			}
			return section;
		});

		if (sections.length === 0) {
			sections = [{ id: generateId('section'), blocks: [newBlock] }];
		}

		selectedBlockId = newBlock.id;
		draggedBlockType = null;
	}

	function handleBlockSelect(id: string) {
		selectedBlockId = id;
	}

	function handleBlockMove(blockId: string, targetSectionIndex: number, targetBlockIndex: number) {
		let movedBlock: CanvasBlock | null = null;
		let sourceSectionIndex = -1;
		let sourceBlockIndex = -1;

		// Find and remove the block from its current location
		for (let i = 0; i < sections.length; i++) {
			const blockIdx = sections[i].blocks.findIndex((b: CanvasBlock) => b.id === blockId);
			if (blockIdx !== -1) {
				movedBlock = sections[i].blocks[blockIdx];
				sourceSectionIndex = i;
				sourceBlockIndex = blockIdx;
				break;
			}
		}

		if (!movedBlock) return;

		sections = sections.map((section, sIdx) => {
			if (sIdx === sourceSectionIndex) {
				return {
					...section,
					blocks: section.blocks.filter((b: CanvasBlock) => b.id !== blockId)
				};
			}
			return section;
		});

		// Adjust target index if moving within the same section
		let adjustedTargetIndex = targetBlockIndex;
		if (
			sourceSectionIndex === targetSectionIndex &&
			sourceBlockIndex < targetBlockIndex &&
			sourceBlockIndex !== -1
		) {
			adjustedTargetIndex--;
		}

		// Insert into target location
		sections = sections.map((section, idx) => {
			if (idx === targetSectionIndex) {
				const updatedBlocks = [...section.blocks];
				updatedBlocks.splice(adjustedTargetIndex, 0, movedBlock);
				return { ...section, blocks: updatedBlocks };
			}
			return section;
		});
	}

	function handleBlockDelete(id: string) {
		sections = sections.map((section) => ({
			...section,
			blocks: section.blocks.filter((b: CanvasBlock) => b.id !== id)
		}));

		// Remove empty sections (except if it's the only one)
		sections = sections.filter((s, idx) => s.blocks.length > 0 || sections.length === 1);

		if (selectedBlockId === id) {
			selectedBlockId = null;
		}
	}

	function handlePropertiesChange(updatedBlock: CanvasBlock) {
		sections = sections.map((section) => ({
			...section,
			blocks: section.blocks.map((b: CanvasBlock) => (b.id === updatedBlock.id ? updatedBlock : b))
		}));
	}

	function handleDragEnd() {
		draggedBlockType = null;
	}

	function handleNewSection() {
		sections = [...sections, { id: generateId('section'), blocks: [] }];
	}

	function handleClearCanvas() {
		sections = [{ id: generateId('section'), blocks: [] }];
		selectedBlockId = null;
	}

	// Initialize with one empty section
	$effect(() => {
		if (sections.length === 0) {
			sections = [{ id: generateId('section'), blocks: [] }];
		}
	});
</script>

<div
	class="flex h-[calc(100vh-200px)] min-h-[600px] gap-4"
	style="direction: {$direction === 'lr' ? 'ltr' : 'rtl'}"
>
	<!-- Left Sidebar: Block Palette -->
	<Card.Root class="w-64 shrink-0 overflow-y-auto">
		<Card.Header class="pb-2">
			<Card.Title class="text-lg">{$t('common.template_builder.blocks')}</Card.Title>
			<Card.Description>{$t('common.template_builder.drag_blocks')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<BlockPalette onDragStart={handlePaletteDragStart} onDragEnd={handleDragEnd} />
		</Card.Content>
	</Card.Root>

	<!-- Center: Canvas -->
	<Card.Root class="flex-1 overflow-hidden">
		<Card.Header class="pb-2">
			<Card.Title class="text-lg">{$t('common.template_builder.canvas')}</Card.Title>
			<Card.Description>{$t('common.template_builder.canvas_description')}</Card.Description>
		</Card.Header>
		<Card.Content class="h-[calc(100%-80px)] p-0">
			<BuilderCanvas
				{sections}
				{selectedBlockId}
				isDragging={draggedBlockType !== null}
				onDrop={handleCanvasDrop}
				onBlockSelect={handleBlockSelect}
				onBlockMove={handleBlockMove}
				onBlockDelete={handleBlockDelete}
				onNewSection={handleNewSection}
			/>
		</Card.Content>
	</Card.Root>

	<!-- Right Sidebar: Properties Panel -->
	<Card.Root class="w-72 shrink-0 overflow-y-auto">
		<Card.Header class="pb-2">
			<Card.Title class="text-lg">{$t('common.template_builder.properties')}</Card.Title>
			<Card.Description>
				{#if selectedBlock}
					{$t('common.template_builder.edit_properties')}
				{:else}
					{$t('common.template_builder.select_block')}
				{/if}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if selectedBlock}
				<BlockProperties block={selectedBlock} onChange={handlePropertiesChange} />
			{:else}
				<p class="text-muted-foreground text-center text-sm">
					{$t('common.template_builder.no_selection')}
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<!-- Action Bar -->
<div class="mt-4 flex justify-end gap-2">
	<Button variant="outline" onclick={handleClearCanvas}>
		{$t('common.template_builder.clear_canvas')}
	</Button>
	<Button disabled={sections.every((s) => s.blocks.length === 0)}>
		{$t('common.template_builder.save_template')}
	</Button>
</div>
