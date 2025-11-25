<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import * as Card from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { t } from '$lib/i18n';
	import { type AppCustomEvent } from '$lib/models/common';
	import { type FormTemplate } from '$lib/server/database/schemas/form';

	let { data }: { data: { templates: Promise<FormTemplate[]> } } = $props();

	function onFormTemplateCardEvent(event: AppCustomEvent<FormTemplate>) {
		switch (event.type) {
			case AppCustomEventType.Create: {
				goto(resolve(`/forms/create?${SearchParams.TemplateId}=${event.data?.id}`));
				break;
			}
		}
	}
</script>

<BasePage title="common.templates_raw" description="seo.description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.templates_raw')}</h2>
		<p class="text-lg font-light">{$t('common.templates_description')}</p>
	{/snippet}
	<div class="grid w-full grid-cols-3 gap-2">
		{#await data.templates}
			{@render SkeletonFormTemplateCard()}
			{@render SkeletonFormTemplateCard()}
			{@render SkeletonFormTemplateCard()}
		{:then templates}
			{#each templates as template (template.id)}
				<FormTemplateCard data={template} onEvent={onFormTemplateCardEvent} />
			{/each}
		{/await}
	</div>
</BasePage>

{#snippet SkeletonFormTemplateCard()}
	<Card.Root class="flex-column flex justify-between">
		<Card.Header>
			<Skeleton class="h-4 w-12" />
			<Skeleton class="h-4 w-48" />
		</Card.Header>
		<Card.Footer class="align-items flex flex-row gap-2">
			<Skeleton class="h-8 w-24" />
		</Card.Footer>
	</Card.Root>
{/snippet}
