<script lang="ts">
	import { GET } from '$lib/api/helpers/request';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { t } from '$lib/i18n';
	import type { FormSubmissionCandidateDataSelect } from '$lib/server/database/schemas/form';
	import { LoaderCircle, RotateCw } from '@lucide/svelte';
	let { preProcessedSubmission }: { preProcessedSubmission: FormSubmissionCandidateDataSelect } =
		$props();
	let inProgress = $state(false);

	async function regenerate() {
		inProgress = true;
		inProgress = false;
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button variant="ghost" size="icon" disabled={inProgress} onclick={regenerate}>
			{#if inProgress}
				<LoaderCircle size={16} class="animate-spin" />
			{:else}
				<RotateCw size={16} />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{$t('common.regenerate_form')}
	</Tooltip.Content>
</Tooltip.Root>
