<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { FormDataPOST, PUT } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormSubmission, FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { FormsSubmissions, UsersForms } from '../../../../api';
	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	async function onFormSubmitted(file: File) {
		const submitRes = await createNewSubmission(file);
		if (submitRes) {
			goto(resolve('/submitted'));
		} else {
			// error message
		}
	}

	async function createNewSubmission(file: File) {
		const data = new FormData();
		data.append('user_form_id', String(form.id));
		data.append('file', file);
		const submitted = await FormDataPOST<{ created: FormSubmission }>(FormsSubmissions, data);
		const result = !!submitted?.created;
		if (result) {
			PUT<Pick<UserForm, 'submissions'>, unknown, { updated: UserForm }>(
				`${UsersForms}/${form!.id}`,
				{
					submissions: 1
				},
				{}
			);
		}
		return result;
	}
</script>

<BasePage title="common.sign" description="seo.description">
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} onSubmit={onFormSubmitted} />
	{/if}
</BasePage>
