<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { POST } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type {
		FormSubmissionCandidateDataSelect,
		FormTemplate,
		UserForm
	} from '$lib/server/database/schemas/form';
	import { toast } from 'svelte-sonner';
	import { FormSubmissionCandidateData, RemoteBrowserServiceCreatePdf } from '../../../../api';
	import type { UserFormData } from '$lib/models/user-form-data';
	import type { SignedFormUserPreferedOptions } from '$lib/models/signed-form-user-prefered-options';

	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	async function onFormSubmitted(data: UserFormData, options?: SignedFormUserPreferedOptions) {
		const submissionCandidateData = await POST<
			{ user_form_id: number; data: UserFormData; options?: SignedFormUserPreferedOptions },
			{ created: FormSubmissionCandidateDataSelect[] }
		>(FormSubmissionCandidateData, {
			user_form_id: form.id,
			data: data,
			options
		});
		if (!submissionCandidateData.created?.length || !submissionCandidateData.created[0]?.id) {
			toast.error('Could not complete process, internal server error');
		}
		const submitRes = await requestFormSubmissionCreation(submissionCandidateData.created[0].id);
		if (submitRes) {
			goto(resolve('/submitted'));
		} else {
			toast.error('submission failed');
		}
	}

	async function requestFormSubmissionCreation(submissionCandidateDataId: number) {
		if (!form.public_link_identifier) return;
		const createPdfRequest = await POST<
			{
				formPublicLinkIndentifier: string;
				formId: number;
				formName: string;
				submissionCandidateDataId: number;
			},
			{ success: boolean }
		>(RemoteBrowserServiceCreatePdf, {
			formPublicLinkIndentifier: form.public_link_identifier,
			formId: form.id,
			formName: form.name,
			submissionCandidateDataId
		});
		return createPdfRequest;
	}
</script>

<BasePage title={form.name} description={form.description ?? 'seo.description'}>
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} onSubmit={onFormSubmitted} />
	{/if}
</BasePage>
