<script lang="ts">
	import SignaturePad from 'signature_pad';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { Pen, Trash, X } from '@lucide/svelte';
	import { t } from '$lib/i18n';

	type SignaturePadProps = {
		fieldId: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		onChange?: (newValue: string) => void;
		mode?: 'display';
	};

	let {
		fieldId,
		value = $bindable(),
		required = false,
		disabled = false,
		onChange,
		mode
	}: SignaturePadProps = $props();

	let open = $state(false);
	let canvasElement = $state<HTMLCanvasElement>();
	let signaturePad: SignaturePad | null = null;

	// Initialize signature pad when dialog opens
	$effect(() => {
		if (open && canvasElement && !signaturePad) {
			// Set canvas size
			const canvas = canvasElement;
			const ratio = Math.max(window.devicePixelRatio || 1, 1);
			const rect = canvas.getBoundingClientRect();

			canvas.width = rect.width * ratio;
			canvas.height = rect.height * ratio;
			canvas.getContext('2d')?.scale(ratio, ratio);

			signaturePad = new SignaturePad(canvas, {
				backgroundColor: 'rgb(255, 255, 255)',
				penColor: 'rgb(0, 0, 0)'
			});

			// Load existing signature if present
			if (value) {
				try {
					signaturePad.fromDataURL(value);
				} catch (error) {
					console.error('Failed to load signature:', error);
				}
			}
		}
	});

	const handleClear = () => {
		signaturePad?.clear();
		value = '';
		onChange?.(value);
	};

	const handleSave = () => {
		if (signaturePad && !signaturePad.isEmpty()) {
			value = signaturePad.toDataURL('image/svg+xml');
			onChange?.(value);
		} else if (required) {
			// Don't close if required and empty
			return;
		} else {
			value = undefined;
		}
		open = false;
		signaturePad = null;
	};

	const handleCancel = () => {
		open = false;
		signaturePad = null;
	};

	const handleOpenChange = (isOpen: boolean) => {
		open = isOpen;
		if (!isOpen) {
			signaturePad = null;
		}
	};

	const handleDelete = () => {
		value = undefined;
		onChange?.('');
	};
</script>

<div id={fieldId} class="flex items-center gap-2">
	{#if value}
		<!-- Display existing signature -->
		<div class="flex flex-1 items-center gap-2">
			<img src={value} alt="Signature" class="h-20 rounded border border-gray-300 bg-white px-2" />
			{#if !disabled && mode !== 'display'}
				<div class="flex flex-col gap-2">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onclick={() => (open = true)}
						aria-label={$t('common.signature_field.edit_signature')}
					>
						<Pen class="h-4 w-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onclick={handleDelete}
						aria-label={$t('common.delete')}
					>
						<Trash class="h-4 w-4" />
					</Button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- No signature yet -->
		<Button type="button" variant="outline" onclick={() => (open = true)} {disabled}>
			<Pen class="mr-2 h-4 w-4" />
			{$t('common.signature_field.add_signature')}
		</Button>
	{/if}
</div>

<Dialog {open} onOpenChange={handleOpenChange}>
	<DialogContent class="max-w-2xl">
		<DialogHeader>
			<DialogTitle>{$t('common.signature_field.signature_pad_title')}</DialogTitle>
		</DialogHeader>

		<div class="my-4">
			<canvas
				bind:this={canvasElement}
				class="w-full touch-none rounded-md border-2 border-gray-300"
				style="height: 300px;"
			></canvas>
		</div>

		<DialogFooter class="gap-2">
			<Button type="button" variant="outline" onclick={handleClear}>
				<X class="mr-2 h-4 w-4" />
				{$t('common.signature_field.clear')}
			</Button>
			<Button type="button" variant="outline" onclick={handleCancel}>
				{$t('common.signature_field.cancel')}
			</Button>
			<Button type="button" onclick={handleSave}>
				{$t('common.signature_field.save')}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
