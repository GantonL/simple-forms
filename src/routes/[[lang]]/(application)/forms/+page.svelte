<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormTemplateCard from '$lib/components/form-template-card/form-template-card.svelte';
	import { t } from '$lib/i18n';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	const userForms: UserForm[] = $derived(page.data.userForms);
	const templates: FormTemplate[] = $derived(page.data.templates);
</script>

<BasePage title="common.forms" description="seo.description">
	<h2 class="text-xl">{$t('common.your_forms')}</h2>
	{#each userForms as userForm (userForm.id)}
		{userForm.public_link_identifier}
	{/each}
	<h2 class="text-xl">{$t('common.available_templates')}</h2>
	<div class="grid w-full grid-cols-3 gap-2">
		{#each templates as template (template.id)}
			<FormTemplateCard data={template} />
		{/each}
	</div>
</BasePage>
