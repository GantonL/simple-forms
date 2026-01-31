<script lang="ts">
	import { page } from '$app/state';
	import { FormsPageItem, SpecificFormPageItem } from '$lib/client/configurations/breadcrumbs';
	import AppBreadcrumbs from '$lib/components/app-breadcrumbs/app-breadcrumbs.svelte';
	import FormCreateEdit from '$lib/components/form-create-edit/form-create-edit.svelte';
	import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	import { Pen } from '@lucide/svelte';

	const template: FormTemplate = $derived(page.data.template);
	const userForm: UserForm = $derived(page.data.userForm);

	function getBreadcrumbsItems(): BreadcrumbItemConfiguration[] {
		return [
			FormsPageItem,
			SpecificFormPageItem(userForm),
			{
				label: 'common.edit',
				icon: Pen,
				link: ''
			}
		];
	}
</script>

<div class="w-full">
	<AppBreadcrumbs items={getBreadcrumbsItems()}></AppBreadcrumbs>
</div>
<FormCreateEdit {template} {userForm} />
