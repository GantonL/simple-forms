<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import type { ColumnDef } from '@tanstack/table-core';
	import { page } from '$app/state';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';

	const templates: Record<FormTemplate['id'], FormTemplate> = $derived(page.data.templates);
	const forms: UserForm[] = $derived(page.data.forms);
	interface FormSubmission {
		id: number;
		formName: string;
		submittedBy: string;
		submittedAt: Date;
		status: string;
	}

	// Mock data for form submissions
	const submissions: FormSubmission[] = [
		{
			id: 1,
			formName: 'Contact Form',
			submittedBy: 'john@example.com',
			submittedAt: new Date('2024-01-15'),
			status: 'new'
		},
		{
			id: 2,
			formName: 'Survey 2024',
			submittedBy: 'jane@example.com',
			submittedAt: new Date('2024-01-14'),
			status: 'reviewed'
		},
		{
			id: 3,
			formName: 'Registration Form',
			submittedBy: 'bob@example.com',
			submittedAt: new Date('2024-01-13'),
			status: 'new'
		}
	];

	// Define columns for submissions table
	const columns: ColumnDef<FormSubmission>[] = [
		{
			accessorKey: 'id',
			header: 'common.id',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'formName',
			header: 'common.form_name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'submittedBy',
			header: 'common.submitted_by',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'submittedAt',
			header: 'common.submitted_at',
			cell: (info) => new Date(info.getValue() as Date).toLocaleDateString()
		},
		{
			accessorKey: 'status',
			header: 'common.status',
			cell: (info) => info.getValue()
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
							<Card.Title>{templates[userForm.template_id].name}</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								<p class="text-sm">
									{$t('common.submissions')}: {userForm.submissions}
								</p>
								<p class="text-muted-foreground text-sm">
									{$t('common.created')}: {userForm.createdAt.toLocaleDateString()}
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
