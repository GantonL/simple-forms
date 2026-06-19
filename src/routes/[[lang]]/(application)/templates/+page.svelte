<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import { type FormTemplate } from '$lib/server/database/schemas/form';
	import { LoaderCircle } from '@lucide/svelte';
	import { FormsTemplates } from '../../../api';
	import { GET } from '$lib/api/helpers/request';
	import { onMount } from 'svelte';
	import { DEFAULT_LIMIT } from '$lib/api/configurations/common';

	const templatesStream = $state(page.data.templates);
	let offset = 0;
	let noMoreTemplates = $state(false);
	let dataLoading = $state(false);
	let displayTemplates: FormTemplate[] = $state([]);

	onMount(() => {
		templatesStream.then((initial) => {
			displayTemplates = initial ?? [];
		});
	});

	function onFormTemplateCardEvent(event: AppCustomEvent<FormTemplate>) {
		switch (event.type) {
			case AppCustomEventType.Create: {
				goto(resolve(`/forms/create?${SearchParams.TemplateId}=${event.data?.id}`));
				break;
			}
		}
	}

	async function onLoadMoreTemplates() {
		dataLoading = true;
		offset = displayTemplates.length;
		const templatesRes = await GET<FormTemplate[]>(
			`${FormsTemplates}${`?limit=${DEFAULT_LIMIT}&offset=${offset}`}`
		);
		if (!templatesRes?.length) {
			noMoreTemplates = true;
		}
		displayTemplates.push(...templatesRes);
		dataLoading = false;
	}
</script>

<BasePage
	title="common.templates_raw"
	description="seo.pages.templates.description"
	dataLoader={{ event: 'scroll', threshold: 75 }}
	onLoadMore={onLoadMoreTemplates}
	endOfData={noMoreTemplates}
	{dataLoading}
>
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.templates_raw')}</h2>
		<p class="text-lg font-light">{$t('common.templates_description')}</p>
	{/snippet}
	{#if displayTemplates?.length}
		<div class="grid w-full grid-cols-3 gap-2 max-lg:grid-cols-1">
			{#each displayTemplates as template (template.id)}
				<FormTemplateCard data={template} onEvent={onFormTemplateCardEvent} />
			{/each}
		</div>
	{:else}
		<div class="flex h-12 items-center justify-center">
			<LoaderCircle class="text-primary animate-spin" />
		</div>
	{/if}
</BasePage>
