<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);
</script>

<BasePage title="common.sign" description="seo.description">
	{#if schema && form.data}
		<FormPreview {schema} userData={form.data!} />
	{/if}
</BasePage>
