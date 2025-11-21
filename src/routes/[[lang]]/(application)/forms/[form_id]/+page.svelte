<script lang="ts">
	import { page } from '$app/state';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import { t } from '$lib/i18n';
	import type { TableConfiguration } from '$lib/models/table';
	import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';
	import { columns, tableConfiguration } from './configurations';
	const userForm: UserForm = $state(page.data.userForm);
	const submissions: FormSubmission[] = $state(page.data.submissions);

	let configuration = $derived({
		...tableConfiguration,
		serverSide: {
			...tableConfiguration.serverSide,
			totalItems: userForm.submissions
		} as TableConfiguration<FormSubmission>['serverSide']
	});
</script>

<h2 class="mb-4 text-2xl font-bold">{$t('common.form_submissions')}</h2>
<AppDataTable data={submissions} {columns} {configuration} />
