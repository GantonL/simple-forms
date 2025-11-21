<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { SearchParams } from '$lib/enums/search-params';
	import { type AppCustomEvent } from '$lib/models/common';
	import { type FormTemplate } from '$lib/server/database/schemas/form';
	const templates = $state(page.data.templates);

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
	<div class="grid w-full grid-cols-3 gap-2">
		{#each templates as template (template.id)}
			<FormTemplateCard data={template} onEvent={onFormTemplateCardEvent} />
		{/each}
	</div>
</BasePage>
