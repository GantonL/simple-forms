<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { POST, PUT } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormSubmission, FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { FormsSubmissions, UploadUrl, UsersForms } from '../../../../api';

	const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);

	async function onFormSubmitted(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			// TODO: show error to user
			console.error('File too large. Max size is 5MB');
			return;
		}

		const submitRes = await createNewSubmission(file);
		if (submitRes) {
			goto(resolve('/submitted'));
		} else {
			// error message
		}
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
