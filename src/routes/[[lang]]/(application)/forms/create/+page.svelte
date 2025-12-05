<script lang="ts">
	import { page } from '$app/state';
	import FormCreateEdit from '$lib/components/form-create-edit/form-create-edit.svelte';
	import type { FormTemplate } from '$lib/server/database/schemas/form';

	const template: FormTemplate = $derived(page.data.template);
</script>

<FormCreateEdit {template} />
