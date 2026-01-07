<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { POST } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { toast } from 'svelte-sonner';
	import { RemoteBrowserServiceCreatePdf } from '../../../../api';

	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	async function onFormSubmitted() {
		const submitRes = await requestFormSubmissionCreation();
		if (submitRes) {
			goto(resolve('/submitted'));
		} else {
			toast.error('submission failed');
		}
	}

	async function requestFormSubmissionCreation() {
		if (!form.public_link_identifier) return;
		const createPdfRequest = await POST<
			{ formPublicLinkIndentifier: string; formId: number; formName: string },
			{ success: boolean }
		>(RemoteBrowserServiceCreatePdf, {
			formPublicLinkIndentifier: form.public_link_identifier,
			formId: form.id,
			formName: form.name
		});
		return createPdfRequest;
	}
</script>

<BasePage title={form.name} description={form.description ?? 'seo.description'}>
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} onSubmit={onFormSubmitted} />
	{/if}
</BasePage>
