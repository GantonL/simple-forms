<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { POST, PUT } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormSubmission, FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { FormsSubmissions, UsersForms } from '../../../../api';
	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	function onFormSubmitted() {
		createNewSubmission();
		goto(resolve('/submitted'));
	}

	function createNewSubmission() {
		POST<Pick<FormSubmission, 'storage_url' | 'user_form_id'>[], { create: FormSubmission }>(
			FormsSubmissions,
			[
				{
					user_form_id: form.id,
					storage_url: 'http://file-location.com'
				}
			]
		);
		PUT<Pick<UserForm, 'submissions'>, unknown, { updated: UserForm }>(
			`${UsersForms}/${form!.id}`,
			{
				submissions: 1
			},
			{}
		);
	}
</script>

<BasePage title="common.sign" description="seo.description">
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} onSubmit={onFormSubmitted} />
	{/if}
</BasePage>
