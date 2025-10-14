<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';
	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);
</script>

<BasePage title="common.sign" description="seo.description">
	<h1>{form.name}</h1>
</BasePage>
