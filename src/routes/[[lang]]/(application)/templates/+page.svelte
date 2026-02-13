<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { TemplatesPageItem } from '$lib/client/configurations/breadcrumbs';
	import AppBreadcrumbs from '$lib/components/app-breadcrumbs/app-breadcrumbs.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import { type FormTemplate } from '$lib/server/database/schemas/form';
	import { pageActions } from './configurations';
	const sidebar = useSidebar();
	let { data }: { data: { templates: FormTemplate[] } } = $props();

	function onFormTemplateCardEvent(event: AppCustomEvent<FormTemplate>) {
		switch (event.type) {
			case AppCustomEventType.Create: {
				goto(resolve(`/forms/create?${SearchParams.TemplateId}=${event.data?.id}`));
				break;
			}
		}
	}
	function onPageAction(event: string) {
		switch (event) {
			case 'create': {
				goto(resolve('/templates/create'));
				break;
			}
		}
	}
</script>

<BasePage title="common.templates_raw" description="seo.pages.templates.description">
	{#snippet header()}
		<div class="flex w-full flex-row items-start justify-between">
			<div class="flex max-w-xl min-w-0 flex-col gap-2">
				<h2 class="truncate text-2xl font-bold">{$t('common.templates_raw')}</h2>
				<p class="text-lg font-light">{$t('common.templates_description')}</p>
			</div>
			<div class="flex flex-row flex-wrap items-center justify-end gap-2">
				{#each pageActions as action (action)}
					<Button
						class="flex flex-row items-center gap-2"
						variant="outline"
						onclick={() => onPageAction(action.event)}
					>
						<action.icon size={16} />
						<span class:hidden={sidebar.isMobile}>{$t(action.label)}</span>
					</Button>
				{/each}
			</div>
		</div>
	{/snippet}
	<div class="grid w-full grid-cols-3 gap-2 max-lg:grid-cols-1">
		{#each data.templates as template (template.id)}
			<FormTemplateCard data={template} onEvent={onFormTemplateCardEvent} />
		{/each}
	</div>
</BasePage>
