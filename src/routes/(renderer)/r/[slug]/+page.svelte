<script lang="ts">
	import { page } from '$app/state';
	import FormPreview from '$lib/components/form-preview/form-preview.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';

	const form: UserForm = $derived(page.data.form);
	const schema: FormTemplate['schema'] = $derived(page.data.schema);
</script>

{#if schema && form.data}
	<FormPreview {schema} userData={form.data!} forceFieldRendererMode="display" />
{/if}
