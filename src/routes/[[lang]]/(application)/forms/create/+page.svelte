<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { FormTemplate } from '$lib/server/database/schemas/form';
	const template: FormTemplate = $derived(page.data.template);
</script>

<BasePage title="common.create" description="seo.description">
	{template.key}
</BasePage>
