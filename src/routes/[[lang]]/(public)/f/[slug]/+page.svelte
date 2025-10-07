<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import type { UserForm } from '$lib/server/database/schemas/form';
	const form: UserForm = $derived(page.data.data);
</script>

<BasePage title="common.sign" description="seo.description">
	{form}
</BasePage>
