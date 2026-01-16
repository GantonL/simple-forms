<script lang="ts">
	import { POST } from '$lib/api/helpers/request';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { t } from '$lib/i18n';
	import type { FormSubmissionCandidateDataSelect } from '$lib/server/database/schemas/form';
	import { Check, LoaderCircle, RotateCw, X } from '@lucide/svelte';
	import { RemoteBrowserServiceCreatePdf } from '../../../../../api';
	import { toast } from 'svelte-sonner';
	let { preProcessedSubmission }: { preProcessedSubmission: FormSubmissionCandidateDataSelect } =
		$props();
	let inProgress = $state(false);
	let success = $state();

	async function regenerate() {
		inProgress = true;
		const res = await requestFormSubmissionCreation(preProcessedSubmission.id);
		if (res?.success) {
			toast.success(t.get('common.regeneration_success'));
			success = true;
		} else {
			toast.success(t.get('common.regeneration_failed'));
			success = false;
		}
		inProgress = false;
	}

	async function requestFormSubmissionCreation(submissionCandidateDataId: number) {
		const createPdfRequest = await POST<
			{
				submissionCandidateDataId: number;
				formId: number;
			},
			{ success: boolean }
		>(`${RemoteBrowserServiceCreatePdf}/regenerate`, {
			submissionCandidateDataId,
			formId: preProcessedSubmission.user_form_id
		});
		return createPdfRequest;
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant="ghost"
			size="icon"
			disabled={inProgress || success !== undefined}
			onclick={regenerate}
		>
			{#if inProgress}
				<LoaderCircle size={16} class="animate-spin" />
			{:else if success}
				<Check size={16} />
			{:else if success === false}
				<X size={16} />
			{:else if success === undefined}
				<RotateCw size={16} />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{#if success}
			{$t('common.regeneration_success')}
		{:else if success === false}
			{$t('common.regeneration_failed')}
		{:else if success === undefined}
			{$t('common.regenerate_form')}
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
