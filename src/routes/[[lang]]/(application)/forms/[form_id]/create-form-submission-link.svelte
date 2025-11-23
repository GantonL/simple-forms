<script lang="ts">
	import { GET } from '$lib/api/helpers/request';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { FormSubmission } from '$lib/server/database/schemas/form';
	import { AlertCircleIcon, Copy, ExternalLink, LoaderCircle } from '@lucide/svelte';
	import { SignedUrl } from '../../../../api';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { copyToClipboard } from '$lib/client/utils';
	import { t } from '$lib/i18n';
	import { toast } from 'svelte-sonner';
	let { submission }: { submission: FormSubmission } = $props();
	let inProgress = $state(false);
	let dialogOpened = $state(false);

	interface SignedUrlResponse {
		data: {
			signedUrl: string;
		};
	}
	let signedUrl = $state<string>();

	async function createLink() {
		inProgress = true;
		const signedUrlResponse = await GET<SignedUrlResponse>(SignedUrl(submission.id));
		inProgress = false;
		if (signedUrlResponse?.data?.signedUrl) {
			signedUrl = signedUrlResponse.data.signedUrl;
			dialogOpened = true;
		}
	}

	function onCopyLink() {
		if (!signedUrl) {
			return;
		}
		copyToClipboard(signedUrl).then(() => {
			toast.success(t.get('common.link_copied_to_clipboard'));
		});
	}
</script>

<Button variant="ghost" size="icon" disabled={inProgress} onclick={createLink}>
	{#if inProgress}
		<LoaderCircle size={16} class="animate-spin" />
	{:else}
		<ExternalLink size={16} />
	{/if}
</Button>

<Dialog.Root bind:open={dialogOpened}>
	<Dialog.Content>
		<p class="truncate p-2 italic" dir="ltr">{signedUrl}</p>
		<Alert.Root>
			<AlertCircleIcon />
			<Alert.Title>{$t('common.link_available_for_limited_time')}</Alert.Title>
		</Alert.Root>
		<Button class="flex flex-row items-center gap-2" onclick={onCopyLink}>
			<Copy size={16} />
			<span>{$t('common.copy_link')}</span>
		</Button>
	</Dialog.Content>
</Dialog.Root>
