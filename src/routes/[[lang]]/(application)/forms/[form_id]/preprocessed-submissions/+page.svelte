<script lang="ts">
	import { page } from '$app/state';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { t } from '$lib/i18n';
	import type {
		FormSubmissionCandidateDataSelect,
		UserForm
	} from '$lib/server/database/schemas/form';
	import { columns, tableConfiguration } from './configurations';
	const userForm: UserForm = $state(page.data.userForm);
	let preProcessedSubmissions: FormSubmissionCandidateDataSelect[] = $state(
		page.data.preProcessedSubmissions
	);
</script>

<BasePage title="common.forms" description="seo.pages.form_detail.description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{userForm.name} | {$t('common.x_preprocessed_submissions')}</h2>
	{/snippet}
	<div class="flex flex-col items-center gap-2">
		<AppDataTable data={preProcessedSubmissions} {columns} configuration={tableConfiguration} />
	</div>
</BasePage>
