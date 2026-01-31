<script lang="ts">
	import { page } from '$app/state';
	import { TemplatesPageItem } from '$lib/client/configurations/breadcrumbs';
	import AppBreadcrumbs from '$lib/components/app-breadcrumbs/app-breadcrumbs.svelte';
	import FormCreateEdit from '$lib/components/form-create-edit/form-create-edit.svelte';
	import type { BreadcrumbItemConfiguration } from '$lib/models/breadcrumb-item-configuration';
	import type { FormTemplate } from '$lib/server/database/schemas/form';
	import { FilePlus } from '@lucide/svelte';

	const template: FormTemplate = $derived(page.data.template);
	function getBreadcrumbsItems(): BreadcrumbItemConfiguration[] {
		return [
			TemplatesPageItem,
			{
				label: 'common.create',
				icon: FilePlus,
				link: ''
			}
		];
	}
</script>

<div class="w-full">
	<AppBreadcrumbs items={getBreadcrumbsItems()}></AppBreadcrumbs>
</div>
<FormCreateEdit {template} />
