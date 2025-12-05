<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DELETE } from '$lib/api/helpers/request';
	import AppAlertDialog from '$lib/components/app-alert-dialog/app-alert-dialog.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreviewDialog from '$lib/components/form-preview/form-preview-dialog.svelte';
	import UserFormCard from '$lib/components/user-form-card/user-form-card.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { UsersForms } from '../../../api';
	let userForms: UserForm[] = $derived(page.data.userForms);

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
			case AppCustomEventType.Edit: {
				goto(resolve(`/forms/edit?${SearchParams.FormId}=${event.data?.id}`));
				break;
			}
			case AppCustomEventType.Open: {
				goto(resolve(`/forms/${event.data?.id}`));
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
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.my_forms')}</h2>
		<p class="text-lg font-light">{$t('common.my_forms_description')}</p>
	{/snippet}
	<div class="grid w-full grid-cols-3 gap-2 max-lg:grid-cols-1">
		{#each userForms as userForm (userForm.id)}
			<UserFormCard data={userForm} onEvent={onUserCardEvent} />
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
