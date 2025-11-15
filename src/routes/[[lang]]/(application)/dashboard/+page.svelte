<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import type { ColumnDef } from '@tanstack/table-core';
	import { page } from '$app/state';
	import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';

	const forms: UserForm[] = $derived(page.data.forms);

	const submissions: FormSubmission[] = [
		{
			id: 1,
			createdAt: new Date('2024-01-15'),
			storage_url: 'https://file-location.com',
			user_form_id: 1
		},
		{
			id: 2,
			createdAt: new Date('2024-01-15'),
			storage_url: 'https://file-location.com',
			user_form_id: 1
		},
		{
			id: 3,
			createdAt: new Date('2024-01-15'),
			storage_url: 'https://file-location.com',
			user_form_id: 1
		},
		{
			id: 4,
			createdAt: new Date('2024-01-15'),
			storage_url: 'https://file-location.com',
			user_form_id: 1
		}
	];

	// Define columns for submissions table
	const columns: ColumnDef<FormSubmission>[] = [
		{
			accessorKey: 'formName',
			header: 'common.form_name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'createdAt',
			header: 'common.created_at',
			cell: (info) => new Date(info.getValue() as Date).toLocaleDateString()
		},
		{
			accessorKey: 'storage_url',
			header: 'common.address',
			cell: (info) => {}
		}
	];
</script>

<BasePage title="common.dashboard" description="seo.description">
	<div class="container mx-auto space-y-8 py-6">
		<!-- Active Form Templates Section -->
		<section>
			<h2 class="mb-4 text-2xl font-bold">{$t('common.your_active_forms')}</h2>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each forms as userForm (userForm.id)}
					<Card.Root class="p-6">
						<Card.Header>
							<Card.Title>{userForm.name}</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								<p class="text-sm">
									{$t('common.submissions')}: {userForm.submissions ?? 0}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</section>

		<!-- Form Submissions Table Section -->
		<section>
			<h2 class="mb-4 text-2xl font-bold">{$t('common.form_submissions')}</h2>
			<AppDataTable data={submissions} {columns} />
		</section>
	</div>
</BasePage>
