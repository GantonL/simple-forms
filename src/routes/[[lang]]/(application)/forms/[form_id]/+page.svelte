<script lang="ts">
	import { page } from '$app/state';
	import { GET } from '$lib/api/helpers/request';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { t } from '$lib/i18n';
	import type { TableConfiguration } from '$lib/models/table';
	import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';
	import { TriangleAlert } from '@lucide/svelte';
	import { FormsSubmissions } from '../../../../api';
	import { columns, DEFAULT_ORDER_BY, tableConfiguration } from './configurations';
	import Link from '$lib/components/link/link.svelte';
	const userForm: UserForm = $state(page.data.userForm);
	let submissions: FormSubmission[] = $state(page.data.submissions);
	const preProcessedSubmissionsCount: Promise<number> = $state(
		page.data.preProcessedSubmissionsCount
	);
	let configuration = $derived({
		...tableConfiguration,
		serverSide: {
			...tableConfiguration.serverSide,
			totalItems: userForm.submissions
		} as TableConfiguration<FormSubmission>['serverSide']
	});
	let pageSize = $derived(configuration.pageSize ?? 10);
	let fetchInProgress = $state(false);

	async function onPageIndexChaged(newIndex: number) {
		getSubmissionsPage(newIndex);
	}

	async function onPageSizeChanged(newSize: number) {
		pageSize = newSize;
		getSubmissionsPage(0);
	}

	async function getSubmissionsPage(index: number) {
		if (fetchInProgress) return;
		fetchInProgress = true;
		const page = await GET<FormSubmission[]>(FormsSubmissions, {
			limit: pageSize,
			offset: index * pageSize,
			orderBy: DEFAULT_ORDER_BY
		}).finally(() => (fetchInProgress = false));
		submissions = page;
	}
</script>

<BasePage title="common.forms" description="seo.pages.form_detail.description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{userForm.name}</h2>
		<p class="text-lg font-light">{$t('common.user_form_description')}</p>
	{/snippet}
	<div class="flex flex-col items-center gap-2">
		{#await preProcessedSubmissionsCount then count}
			{#if count}
				<Alert.Root variant="destructive" class="max-w-[1200px]">
					<Alert.Title class="flex flex-row items-center gap-2">
						<TriangleAlert size={16} />
						<span>{$t('common.alerts')}</span>
					</Alert.Title>
					<Alert.Description
						><Link
							link={{
								label: 'common.x_preprocessed_submissions',
								labelParams: { count: String(count) },
								path: `/forms/${userForm.id}/preprocessed-submissions`
							}}
							class="hover:underline"
						></Link>
					</Alert.Description>
				</Alert.Root>
			{/if}
		{/await}
		<AppDataTable
			data={submissions}
			{columns}
			{configuration}
			pageIndexChanged={onPageIndexChaged}
			pageSizeChanged={onPageSizeChanged}
			isLoading={fetchInProgress}
			disabled={fetchInProgress}
		/>
	</div>
</BasePage>
