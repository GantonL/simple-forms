<script lang="ts">
	import { GET } from '$lib/api/helpers/request';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { FormSubmission } from '$lib/server/database/schemas/form';
	import { ExternalLink, LoaderCircle } from '@lucide/svelte';
	import { SignedUrl } from '../../../../api';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { t } from '$lib/i18n';

	let { submission }: { submission: FormSubmission } = $props();
	let inProgress = $state(false);

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
			window.open(signedUrl, '_blank');
		} else {
			toast.error('common.failed_to_create_signed_url');
		}
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button variant="ghost" size="icon" disabled={inProgress} onclick={createLink}>
			{#if inProgress}
				<LoaderCircle size={16} class="animate-spin" />
			{:else}
				<ExternalLink size={16} />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{$t('common.download')}
	</Tooltip.Content>
</Tooltip.Root>
