<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	const userForms: UserForm[] = $derived(page.data.userForms);
	const templates: FormTemplate[] = $derived(page.data.templates);
</script>

<BasePage title="common.forms" description="seo.description">
	{#each userForms as userForm (userForm.id)}
		{userForm.public_link_identifier}
	{/each}
	{#each templates as template (template.id)}
		{template.name}
	{/each}
</BasePage>
