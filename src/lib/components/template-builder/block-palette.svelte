<script lang="ts">
	import { t } from '$lib/i18n';
	import { FIELD_TYPES, type BlockType, type FieldType } from './types';
	import * as Icons from '@lucide/svelte';
	import { FileText, GripVertical } from '@lucide/svelte';

	type Props = {
		onDragStart: (type: BlockType, fieldType?: FieldType) => void;
		onDragEnd: () => void;
	};

	let { onDragStart, onDragEnd }: Props = $props();

	function getIcon(iconName: string) {
		const iconMap: Record<string, any> = {
			type: Icons.Type,
			mail: Icons.Mail,
			hash: Icons.Hash,
			phone: Icons.Phone,
			'align-left': Icons.AlignLeft,
			calendar: Icons.Calendar,
			'pen-tool': Icons.PenTool
		};
		return iconMap[iconName] || Icons.Type;
	}

	function handleDragStart(e: DragEvent, type: BlockType, fieldType?: FieldType) {
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = 'copy';
		e.dataTransfer.setData('text/plain', JSON.stringify({ type, fieldType }));
		onDragStart(type, fieldType);
	}

	function handleDragEnd() {
		onDragEnd();
	}
</script>

<div class="space-y-4">
	<!-- Text Block -->
	<div class="space-y-2">
		<h4 class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
			{$t('common.template_builder.content_blocks')}
		</h4>
		<button
			type="button"
			class="bg-secondary/50 hover:bg-secondary flex w-full cursor-grab items-center gap-3 rounded-lg border p-3 transition-colors active:cursor-grabbing"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, 'text')}
			ondragend={handleDragEnd}
		>
			<GripVertical class="text-muted-foreground h-4 w-4" />
			<FileText class="h-5 w-5" />
			<div class="text-start">
				<p class="text-sm font-medium">{$t('common.template_builder.text_block')}</p>
				<p class="text-muted-foreground text-xs">{$t('common.template_builder.text_block_desc')}</p>
			</div>
		</button>
	</div>

	<!-- Field Blocks -->
	<div class="space-y-2">
		<h4 class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
			{$t('common.template_builder.field_blocks')}
		</h4>
		<div class="space-y-1">
			{#each FIELD_TYPES as fieldType (fieldType.value)}
				{@const IconComponent = getIcon(fieldType.icon)}
				<button
					type="button"
					class="bg-secondary/50 hover:bg-secondary flex w-full cursor-grab items-center gap-3 rounded-lg border p-2.5 transition-colors active:cursor-grabbing"
					draggable="true"
					ondragstart={(e) => handleDragStart(e, 'field', fieldType.value)}
					ondragend={handleDragEnd}
				>
					<GripVertical class="text-muted-foreground h-4 w-4" />
					<IconComponent class="h-4 w-4" />
					<span class="text-sm">{$t(fieldType.labelKey)}</span>
				</button>
			{/each}
		</div>
	</div>
</div>
