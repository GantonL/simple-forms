<script lang="ts">
	import { page } from '$app/state';
	import { FormsPageItem, SpecificFormPageItem } from '$lib/client/configurations/breadcrumbs';
	import AppBreadcrumbs from '$lib/components/app-breadcrumbs/app-breadcrumbs.svelte';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { t } from '$lib/i18n';
	import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';
	import type {
		FormSubmissionCandidateDataSelect,
		UserForm
	} from '$lib/server/database/schemas/form';
	import { FileClock } from '@lucide/svelte';
	import { columns, tableConfiguration } from './configurations';
	const userForm: UserForm = $state(page.data.userForm);
	let preProcessedSubmissions: FormSubmissionCandidateDataSelect[] = $state(
		page.data.preProcessedSubmissions
	);
	function getBreadcrumbsItems(): BreadcrumbItemConfiguration[] {
		return [
			FormsPageItem,
			SpecificFormPageItem(userForm),
			{
				label: 'common.x_preprocessed_submissions',
				icon: FileClock,
				link: ''
			}
		];
	}
</script>

<BasePage title="common.forms" description="seo.pages.form_detail.description">
	{#snippet header()}
		<AppBreadcrumbs items={getBreadcrumbsItems()}></AppBreadcrumbs>
		<h2 class="text-2xl font-bold">{userForm.name} | {$t('common.x_preprocessed_submissions')}</h2>
	{/snippet}
	<div class="flex flex-col items-center gap-2">
		<AppDataTable data={preProcessedSubmissions} {columns} configuration={tableConfiguration} />
	</div>
</BasePage>
