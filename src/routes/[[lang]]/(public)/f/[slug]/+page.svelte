<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { GET, POST, PUT } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormSubmission, FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { BaseUrl, FormsSubmissions, UploadUrl, UsersForms } from '../../../../api';

	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	async function onFormSubmitted() {
		const submitRes = await requestRemotePdfCapture();
		if (submitRes) {
			goto(resolve('/submitted'));
		} else {
			// error message
		}
	}

	async function requestRemotePdfCapture() {
		const baseUrl = await GET<string>(BaseUrl);
		const body = JSON.stringify({
			url: `${baseUrl}/r/${form.public_link_identifier}`,
			webhookUrl: `${baseUrl}/webhooks/forms/${form.id}/submision`,
			containerClass: 'form',
			options: {}
		});
		const uploadResponse = await fetch(import.meta.env.VITE_PDF_SERVICE_URL, {
			method: 'POST',
			body
		}).catch((e) => {
			console.log('error requesting pdf creation', e);
			return;
		});

		if (!uploadResponse?.ok) {
			console.error('Upload failed');
			return false;
		}

		return true;
	}

	async function createNewSubmission(file: File) {
		try {
			// Get signed upload URL
			const urlResponse = await POST<
				{ user_form_id: number; fileSize: number },
				{ uploadUrl: string; path: string }
			>(UploadUrl, {
				user_form_id: form.id,
				fileSize: file.size
			});

			if (!urlResponse?.uploadUrl || !urlResponse?.path) {
				console.error('Failed to get upload URL');
				return false;
			}

			// Upload file directly to Supabase
			const buffer = await file.arrayBuffer();
			const uploadResponse = await fetch(urlResponse.uploadUrl, {
				method: 'PUT',
				mode: 'cors',
				credentials: 'omit',
				body: buffer,
				headers: {
					'Content-Type': file.type,
					'Content-Length': buffer.byteLength.toString()
				}
			});

			if (!uploadResponse.ok) {
				console.error('Upload failed');
				return false;
			}

			// Submit metadata
			const submitted = await POST<
				{ user_form_id: number; storage_url: string },
				{ created: FormSubmission }
			>(FormsSubmissions, {
				user_form_id: form.id,
				storage_url: urlResponse.path
			});

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
		} catch (error) {
			console.error('Submission failed:', error);
			return false;
		}
	}
</script>

<BasePage title={form.name} description={form.description ?? 'seo.description'}>
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} onSubmit={onFormSubmitted} />
	{/if}
</BasePage>
