<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import type { FormSubmission, UserForm } from '$lib/server/database/schemas/form';
	import { columns, tableConfiguration } from './configurations';
	import { GET } from '$lib/api/helpers/request';
	import { FormsSubmissions } from '../../../api';
	import { SearchParams } from '$lib/enums/search-params';
	import { page } from '$app/state';

	type DisplaySubmissions = FormSubmission & { userFormName: string };
	const forms: UserForm[] = page.data.forms;
	let submissions: DisplaySubmissions[] = $state(page.data.submissions);
	let totalItems = $state(forms[0]?.submissions ?? 0);
	let fetchSubmissionsInProgress = $state(false);
	let selectedFormId = $state(forms[0]?.id);
	let configuration = $derived({
		...tableConfiguration,
		serverSide: {
			...tableConfiguration.serverSide,
			totalItems
		}
	});

	async function onUserFormCardClick(id: UserForm['id']) {
		selectedFormId = id;
		fetchSubmissionsInProgress = true;
		const subs = await GET<DisplaySubmissions[]>(
			`${FormsSubmissions}?${SearchParams.FormId}=${id}`
		);
		submissions = subs;
		totalItems = forms.find((f) => f.id === id)?.submissions ?? 0;
		fetchSubmissionsInProgress = false;
	}

	async function onPageIndexChanged(e) {
		console.log(e);
	}
</script>

<BasePage title="common.dashboard" description="seo.description">
	<div class="container mx-auto space-y-8 py-6">
		<!-- Active Form Templates Section -->
		<section>
			<h2 class="mb-4 text-2xl font-bold">{$t('common.your_active_forms')}</h2>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each forms as userForm (userForm.id)}
					<Card.Root
						class="cursor-pointer border-[3px] {selectedFormId === userForm.id
							? 'border-primary'
							: ''}"
						onclick={() => onUserFormCardClick(userForm.id)}
					>
						<Card.Header>
							<Card.Title>{userForm.name}</Card.Title>
							<Card.Description>{userForm.description}</Card.Description>
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
			{#key totalItems}
				<AppDataTable
					data={submissions}
					{columns}
					{configuration}
					isLoading={fetchSubmissionsInProgress}
					disabled={fetchSubmissionsInProgress}
					pageIndexChanged={onPageIndexChanged}
				/>
			{/key}
		</section>
	</div>
</BasePage>
