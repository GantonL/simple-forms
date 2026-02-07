<script lang="ts">
	import { t } from '$lib/i18n';
	import {
		type CanvasBlock,
		type Section,
		type FieldTypeConfig,
		isTextBlock,
		isFieldBlock,
		FIELD_TYPES
	} from './types';
	import { GripVertical, Trash2, FileText, Plus } from '@lucide/svelte';
	import * as Icons from '@lucide/svelte';

	type Props = {
		sections: Section[];
		selectedBlockId: string | null;
		isDragging: boolean;
		onDrop: (sectionIndex: number, blockIndex?: number) => void;
		onBlockSelect: (id: string) => void;
		onBlockMove: (blockId: string, targetSectionIndex: number, targetBlockIndex: number) => void;
		onBlockDelete: (id: string) => void;
		onNewSection: () => void;
	};

	let {
		sections,
		selectedBlockId,
		isDragging,
		onDrop,
		onBlockSelect,
		onBlockMove,
		onBlockDelete,
		onNewSection
	}: Props = $props();

	let canvasRef: HTMLDivElement | undefined = $state();
	let dragOverSection = $state<number | null>(null);
	let dragOverBlock = $state<number | null>(null);
	let draggingBlockId = $state<string | null>(null);

	function getFieldIcon(fieldType: string) {
		const iconMap: Record<string, any> = {
			text: Icons.Type,
			email: Icons.Mail,
			number: Icons.Hash,
			tel: Icons.Phone,
			textarea: Icons.AlignLeft,
			date: Icons.Calendar,
			signature: Icons.PenTool
		};
		return iconMap[fieldType] || Icons.Type;
	}

	function handleSectionDragOver(e: DragEvent, sectionIndex: number) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = draggingBlockId ? 'move' : 'copy';
		dragOverSection = sectionIndex;
		dragOverBlock = null;
	}

	function handleBlockDragOver(e: DragEvent, sectionIndex: number, blockIndex: number) {
		e.preventDefault();
		e.stopPropagation();
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = draggingBlockId ? 'move' : 'copy';
		dragOverSection = sectionIndex;
		dragOverBlock = blockIndex;
	}

	function handleDragLeave() {
		dragOverSection = null;
		dragOverBlock = null;
	}

	function handleSectionDrop(e: DragEvent, sectionIndex: number) {
		e.preventDefault();
		e.stopPropagation();

		if (draggingBlockId) {
			onBlockMove(draggingBlockId, sectionIndex, sections[sectionIndex].blocks.length);
		} else {
			onDrop(sectionIndex);
		}

		dragOverSection = null;
		dragOverBlock = null;
	}

	function handleBlockDrop(e: DragEvent, sectionIndex: number, blockIndex: number) {
		e.preventDefault();
		e.stopPropagation();

		if (draggingBlockId) {
			onBlockMove(draggingBlockId, sectionIndex, blockIndex);
		} else {
			onDrop(sectionIndex, blockIndex);
		}

		dragOverSection = null;
		dragOverBlock = null;
	}

	function handleBlockDragStart(e: DragEvent, blockId: string) {
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', blockId);
		draggingBlockId = blockId;
	}

	function handleBlockDragEnd() {
		draggingBlockId = null;
		dragOverSection = null;
		dragOverBlock = null;
	}

	function getFieldTypeLabel(fieldType: string): string {
		const type = FIELD_TYPES.find((ft: FieldTypeConfig) => ft.value === fieldType);
		return type ? $t(type.labelKey) : fieldType;
	}
</script>

<div
	bind:this={canvasRef}
	class="relative h-full overflow-y-auto bg-white p-6"
	class:ring-2={isDragging}
	class:ring-primary={isDragging}
	class:ring-dashed={isDragging}
	ondragleave={handleDragLeave}
	role="application"
	aria-label={$t('common.template_builder.canvas')}
>
	{#if sections.length === 0}
		<div
			role="region"
			aria-label={$t('common.template_builder.drop_here')}
			class="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center"
			ondragover={(e) => {
				e.preventDefault();
				if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
			}}
			ondrop={(e) => {
				e.preventDefault();
				onDrop(0);
			}}
		>
			<FileText class="text-muted-foreground/50 mb-4 h-16 w-16" />
			<h3 class="text-muted-foreground text-lg font-medium">
				{$t('common.template_builder.empty_canvas')}
			</h3>
			<p class="text-muted-foreground/70 mt-1 text-sm">
				{$t('common.template_builder.empty_canvas_hint')}
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each sections as section, sectionIndex (section.id)}
				<div
					role="region"
					aria-label="{$t('common.template_builder.new_section')} {sectionIndex + 1}"
					class="rounded-lg border-2 p-4 transition-all {dragOverSection === sectionIndex &&
					dragOverBlock === null
						? 'border-primary bg-primary/5'
						: ''}"
					ondragover={(e) => handleSectionDragOver(e, sectionIndex)}
					ondrop={(e) => handleSectionDrop(e, sectionIndex)}
				>
					{#if section.blocks.length === 0}
						<div
							class="flex min-h-[80px] items-center justify-center rounded border-2 border-dashed"
						>
							<p class="text-muted-foreground text-sm">
								{$t('common.template_builder.drop_in_section')}
							</p>
						</div>
					{:else}
						<div class="flex flex-wrap gap-3">
							{#each section.blocks as block, blockIndex (block.id)}
								{@const isSelected = selectedBlockId === block.id}
								{@const isDraggingThis = draggingBlockId === block.id}
								<div
									class="group relative min-w-[200px] flex-1 rounded-lg border-2 p-4 transition-all {isSelected ||
									(dragOverSection === sectionIndex && dragOverBlock === blockIndex)
										? 'border-primary bg-primary/5'
										: 'border-transparent'} {!isSelected
										? 'hover:border-muted-foreground/30'
										: ''} {isDraggingThis ? 'opacity-50' : ''}"
									draggable="true"
									ondragstart={(e) => handleBlockDragStart(e, block.id)}
									ondragend={handleBlockDragEnd}
									ondragover={(e) => handleBlockDragOver(e, sectionIndex, blockIndex)}
									ondrop={(e) => handleBlockDrop(e, sectionIndex, blockIndex)}
									role="button"
									tabindex="0"
									onclick={() => onBlockSelect(block.id)}
									onkeydown={(e) => e.key === 'Enter' && onBlockSelect(block.id)}
								>
									<!-- Drag Handle -->
									<div
										class="absolute -start-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<button
											type="button"
											class="cursor-grab rounded bg-white p-1 shadow-sm ring-1 ring-black/5 active:cursor-grabbing"
											aria-label={$t('common.template_builder.drag_to_reorder')}
										>
											<GripVertical class="h-4 w-4" />
										</button>
									</div>

									<!-- Delete Button -->
									<div
										class="absolute -end-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<button
											type="button"
											class="text-destructive hover:bg-destructive/10 rounded bg-white p-1 shadow-sm ring-1 ring-black/5"
											onclick={(e) => {
												e.stopPropagation();
												onBlockDelete(block.id);
											}}
											aria-label={$t('common.delete')}
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>

									<!-- Block Content Preview -->
									{#if isTextBlock(block.properties)}
										<div class="flex items-start gap-3">
											<FileText class="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
											<div class="min-w-0 flex-1">
												<p class="text-xs font-medium text-blue-600">
													{$t('common.template_builder.text_block')}
												</p>
												<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">
													{block.properties.content || $t('common.template_builder.empty_text')}
												</p>
											</div>
										</div>
									{:else if isFieldBlock(block.properties)}
										{@const IconComponent = getFieldIcon(block.properties.fieldType)}
										<div class="flex items-start gap-3">
											<IconComponent class="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
											<div class="min-w-0 flex-1">
												<div class="flex items-center gap-2">
													<p class="text-xs font-medium text-green-600">
														{getFieldTypeLabel(block.properties.fieldType)}
													</p>
													{#if block.properties.required}
														<span class="text-destructive text-xs">*</span>
													{/if}
												</div>
												<p class="mt-1 text-sm font-medium">
													{block.properties.label}
												</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Add Section Button -->
		<button
			type="button"
			class="hover:bg-secondary mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors"
			onclick={onNewSection}
		>
			<Plus class="h-5 w-5" />
			<span>{$t('common.template_builder.new_section')}</span>
		</button>
	{/if}
</div>
