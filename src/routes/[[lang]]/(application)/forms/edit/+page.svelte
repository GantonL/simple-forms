<script lang="ts">
	import { page } from '$app/state';
	import FormCreateEdit from '$lib/components/form-create-edit/form-create-edit.svelte';
	import type { FormTemplate, UserForm } from '$lib/server/database/schemas/form';

	const template: FormTemplate = $derived(page.data.template);
	const userForm: UserForm = $derived(page.data.userForm);
</script>

<FormCreateEdit {template} {userForm} />
