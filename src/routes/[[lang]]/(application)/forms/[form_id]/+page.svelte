<script lang="ts">
	import { page } from '$app/state';
	import { GET } from '$lib/api/helpers/request';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { t } from '$lib/i18n';
	import type { TableConfiguration } from '$lib/models/table';
	import type { FormSubmission, FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { LayoutTemplate, TriangleAlert } from '@lucide/svelte';
	import { FormsSubmissions } from '../../../../api';
	import { columns, DEFAULT_ORDER_BY, pageActions, tableConfiguration } from './configurations';
	import Link from '$lib/components/link/link.svelte';
	import { SearchParams } from '$lib/enums/search-params';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	const userForm: UserForm = $state(page.data.userForm);
	const template: FormTemplate = $state(page.data.template);
	let submissions: FormSubmission[] = $state(page.data.submissions);
	const preProcessedSubmissionsCount: Promise<number> = $state(
		page.data.preProcessedSubmissionsCount
	);
	let totalSubmissions = $state(userForm.submissions);
	let searchTerm = $state(page.data.searchTerm);
	let configuration = $derived({
		...tableConfiguration,
		freeSearchFilter: {
			...tableConfiguration.freeSearchFilter,
			initialValue: searchTerm
		},
		serverSide: {
			...tableConfiguration.serverSide,
			totalItems: totalSubmissions
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

	async function onFreeSearchChanged(newSearchTerm: string) {
		searchTerm = newSearchTerm;
		getSubmissionsPage(0, { count: true });
	}

	async function getSubmissionsPage(index: number, options?: { count?: boolean }) {
		if (fetchInProgress) return;
		fetchInProgress = true;
		if (options?.count) {
			const count = await GET<number>(
				`${FormsSubmissions}/count?${SearchParams.FormId}=${userForm.id}&${SearchParams.FreeSearch}=${searchTerm}`
			);
			totalSubmissions = count;
		}
		const page = await GET<FormSubmission[]>(
			`${FormsSubmissions}?${SearchParams.FormId}=${userForm.id}&${SearchParams.FreeSearch}=${searchTerm}`,
			{
				limit: pageSize,
				offset: index * pageSize,
				orderBy: DEFAULT_ORDER_BY
			}
		).finally(() => (fetchInProgress = false));
		submissions = page;
	}

	function onPageAction(event: string) {
		switch (event) {
			case 'settings': {
				goto(resolve(`/forms/${userForm.id}/settings`));
				break;
			}
			case 'edit': {
				goto(resolve(`/forms/edit?${SearchParams.FormId}=${userForm.id}`));
				break;
			}
		}
	}
</script>

<BasePage title="common.forms" description="seo.pages.form_detail.description">
	{#snippet header()}
		<div class="flex flex-row items-start justify-between">
			<div class="flex flex-col gap-2">
				<h2 class="text-2xl font-bold">{userForm.name}</h2>
				<p class="text-lg font-light">{$t('common.user_form_description')}</p>
				<a
					href={resolve(`/templates?${SearchParams.TemplateId}=${template.id}`)}
					class="bg-secondary/20 flex w-fit flex-row items-center gap-2 rounded-full border px-4 py-1 text-sm"
				>
					<LayoutTemplate size={12} />
					<span>{$t(`common.templates.${template.key}.name`)}</span>
				</a>
			</div>
			<div class="flex flex-row flex-wrap items-center justify-end gap-2">
				{#each pageActions as action (action)}
					<Button
						class="flex flex-row items-center gap-2"
						variant="outline"
						onclick={() => onPageAction(action.event)}
					>
						<action.icon size={16} />
						<span>{$t(action.label)}</span>
					</Button>
				{/each}
			</div>
		</div>
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
			freeSearchChanged={onFreeSearchChanged}
		/>
	</div>
</BasePage>
