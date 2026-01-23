<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DELETE, PUT } from '$lib/api/helpers/request';
	import AppAlertDialog from '$lib/components/app-alert-dialog/app-alert-dialog.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import UserFormCard from '$lib/components/user-form-card/user-form-card.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { UsersForms } from '../../../api';
	let userForms: UserForm[] = $state(page.data.userForms);

	let alertDelete = $state(false);
	let onDeleteForm = $state(() => {});
	let deleteInProgress = $state(false);

	let alertDisable = $state(false);
	let onDisableForm = $state(() => {});

	let alertEnable = $state(false);
	let onEnableForm = $state(() => {});

	let enableOrDisableInProgress = $state(false);

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
			case AppCustomEventType.Disable: {
				onDisableForm = () => disableForm(event.data!.id);
				setTimeout(() => (alertDisable = true));
				break;
			}
			case AppCustomEventType.Enable: {
				onEnableForm = () => enableForm(event.data!.id);
				setTimeout(() => (alertEnable = true));
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

	async function disableForm(id: number) {
		enableOrDisableInProgress = true;
		const updateRes = await PUT<{ is_active: false }, undefined, { updated: UserForm }>(
			`${UsersForms}/${id}`,
			{ is_active: false },
			undefined
		);
		if (updateRes?.updated?.id === id) {
			const updatedForm = userForms.find((uf) => uf.id === id);
			updatedForm!.is_active = false;
		}
		alertDisable = false;
		enableOrDisableInProgress = false;
	}

	async function enableForm(id: number) {
		enableOrDisableInProgress = true;
		const updateRes = await PUT<{ is_active: true }, undefined, { updated: UserForm }>(
			`${UsersForms}/${id}`,
			{ is_active: true },
			undefined
		);
		if (updateRes?.updated?.id === id) {
			const updatedForm = userForms.find((uf) => uf.id === id);
			updatedForm!.is_active = true;
		}
		alertEnable = false;
		enableOrDisableInProgress = false;
	}
</script>

<BasePage title="common.forms" description="seo.pages.forms.description">
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

<AppAlertDialog
	title="common.are_you_sure"
	description="common.disable_user_form_confirm_message"
	bind:open={alertDisable}
	cancel={{ title: 'common.cancel' }}
	action={{
		title: 'common.disable_form_sign',
		class: 'bg-destructive/30 text-destructive hover:text-foreground',
		disabled: enableOrDisableInProgress
	}}
	onAction={onDisableForm}
></AppAlertDialog>

<AppAlertDialog
	title="common.are_you_sure"
	description="common.enable_user_form_confirm_message"
	bind:open={alertEnable}
	cancel={{ title: 'common.cancel' }}
	action={{
		title: 'common.enable_form_sign',
		disabled: enableOrDisableInProgress
	}}
	onAction={onEnableForm}
></AppAlertDialog>
