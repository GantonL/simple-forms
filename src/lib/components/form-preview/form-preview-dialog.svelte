<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import { Dialog } from '../ui/dialog';
	import DialogContent from '../ui/dialog/dialog-content.svelte';
	import FormPreview from './form-preview.svelte';

	interface FormPreviewDialogProps {
		show: boolean;
		schema: FormTemplateSchema;
		data: UserFormData;
	}

	let { show = $bindable(), schema, data }: FormPreviewDialogProps = $props();
</script>

<Dialog open={show} onOpenChange={(open) => (show = open)}>
	<DialogContent class="max-h-[90svh] w-full !max-w-5xl overflow-y-auto">
		<FormPreview {schema} userData={data} mode="demo" />
	</DialogContent>
</Dialog>
