<script lang="ts">
	import { GET, POST } from '$lib/api/helpers/request';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { t } from '$lib/i18n';
	import { Check, CloudDownload, LoaderCircle, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { PaymentsInvoicePdf } from '../../../routes/api';
	let { id, created }: { id: string; created: string } = $props();
	let inProgress = $state(false);
	let success = $state();

	async function download() {
		inProgress = true;
		const res = await downloadInvoice(id);
		if (res) {
			toast.success(t.get('common.download_invoice_success'));
			success = true;
		} else {
			toast.success(t.get('common.download_invoice_failed'));
			success = false;
		}
		inProgress = false;
	}

	async function downloadInvoice(id: string) {
		const pdfRes = await GET<{ pdf: string }>(PaymentsInvoicePdf(id));
		if (pdfRes?.pdf?.length === 0) return;
		const binaryString = atob(pdfRes.pdf);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		const blob = new Blob([bytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `simple_forms_invoice_${created.split(' ').join('_')}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		return true;
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="ghost"
			size="icon"
			disabled={inProgress || success !== undefined}
			onclick={download}
		>
			{#if inProgress}
				<LoaderCircle size={16} class="animate-spin" />
			{:else if success}
				<Check size={16} />
			{:else if success === false}
				<X size={16} />
			{:else if success === undefined}
				<CloudDownload size={16} />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{#if success}
			{$t('common.download_invoice_success')}
		{:else if success === false}
			{$t('common.download_invoice_failed')}
		{:else if success === undefined}
			{$t('common.download_invoice')}
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
