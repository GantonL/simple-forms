<script lang="ts">
	import { t } from '$lib/i18n';
	import Button from '../ui/button/button.svelte';
	import { FIELD_TYPES, type BlockType, type FieldType } from './types';
	import * as Icons from '@lucide/svelte';
	import { FileText } from '@lucide/svelte';

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
			'align-left': Icons.TextAlignStart,
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

<div class="flex flex-col gap-4">
	<!-- Text Block -->
	<div class="flex flex-col gap-1">
		<h4 class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
			{$t('common.template_builder.content_blocks')}
		</h4>
		<Button
			class="flex w-full cursor-grab items-center gap-2 transition-colors active:cursor-grabbing"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, 'text')}
			ondragend={handleDragEnd}
		>
			<FileText />
			<span>{$t('common.template_builder.text_block')}</span>
		</Button>
		<p class="text-muted-foreground text-xs">*{$t('common.template_builder.text_block_desc')}</p>
	</div>

	<!-- Field Blocks -->
	<div class="flex flex-col gap-1">
		<h4 class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
			{$t('common.template_builder.field_blocks')}
		</h4>
		<div class="flex flex-col gap-2 py-1">
			{#each FIELD_TYPES as fieldType (fieldType.value)}
				{@const IconComponent = getIcon(fieldType.icon)}
				<Button
					variant="outline"
					class="flex w-full cursor-grab flex-row items-center gap-2 transition-colors active:cursor-grabbing"
					draggable="true"
					ondragstart={(e) => handleDragStart(e, 'field', fieldType.value)}
					ondragend={handleDragEnd}
				>
					<IconComponent />
					<span>{$t(fieldType.labelKey)}</span>
				</Button>
			{/each}
		</div>
	</div>
</div>
