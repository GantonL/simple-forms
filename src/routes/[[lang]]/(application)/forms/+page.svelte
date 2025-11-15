<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DELETE } from '$lib/api/helpers/request';
	import AppAlertDialog from '$lib/components/app-alert-dialog/app-alert-dialog.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreviewDialog from '$lib/components/form-preview/form-preview-dialog.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import UserFormCard from '$lib/components/user-form-card/user-form-card.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { UsersForms } from '../../../api';
	let userForms: UserForm[] = $derived(page.data.userForms);
	const templates: FormTemplate[] = $derived(page.data.templates);

	let alertDelete = $state(false);
	let onDeleteForm = $state(() => {});
	let deleteInProgress = $state(false);
	let showPreview = $state(false);
	let previewData = $state<UserForm>();
	let previewSchema = $state<FormTemplate['schema']>();

	function onUserCardEvent(event: AppCustomEvent<UserForm>) {
		switch (event.type) {
			case AppCustomEventType.Delete: {
				onDeleteForm = () => deleteForm(event.data!.id);
				setTimeout(() => (alertDelete = true));
				break;
			}
		}
	}

	function onFormTemplateCardEvent(event: AppCustomEvent<FormTemplate>) {
		switch (event.type) {
			case AppCustomEventType.Create: {
				goto(resolve(`/forms/create?${SearchParams.TemplateId}=${event.data?.id}`));
				break;
			}
			case AppCustomEventType.View: {
				showPreview = true;
				previewSchema = event.data?.schema;
				break;
			}
		}
	}

	async function deleteForm(id: number) {
		deleteInProgress = true;
		const deletedRes = await DELETE<unknown, { deleted: UserForm }>(`${UsersForms}/${id}`, {});
		if (deletedRes?.deleted?.id === id) {
			userForms = userForms.filter((uf) => uf.id !== id);
		}
		alertDelete = false;
		deleteInProgress = false;
	}
</script>

<BasePage title="common.forms" description="seo.description">
	<h2 class="text-xl">{$t('common.your_forms')}</h2>
	<div class="grid w-full grid-cols-3 gap-2">
		{#each userForms as userForm (userForm.id)}
			<UserFormCard data={userForm} onEvent={onUserCardEvent} />
		{/each}
	</div>
	<h2 class="text-xl">{$t('common.available_templates')}</h2>
	<div class="grid w-full grid-cols-3 gap-2">
		{#each templates as template (template.id)}
			<FormTemplateCard data={template} onEvent={onFormTemplateCardEvent} />
		{/each}
	</div>
</BasePage>

<AppAlertDialog
	title="common.are_you_sure"
	description="common.delete_user_form_confirm_message"
	bind:open={alertDelete}
	cancel={{ title: 'common.cancel' }}
	action={{
		title: 'common.delete',
		class: 'bg-destructive/30 text-destructive hover:text-foreground',
		disabled: deleteInProgress
	}}
	onAction={onDeleteForm}
></AppAlertDialog>

{#if previewData && previewSchema}
	<FormPreviewDialog bind:show={showPreview} schema={previewSchema!} data={previewData.data!} />
{/if}
