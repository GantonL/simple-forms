<script lang="ts">
	import { t } from '$lib/i18n';
	import type { FormTemplate } from '$lib/server/database/schemas/form';
	import { Eye, FilePlus2, LayoutTemplate } from '@lucide/svelte';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	let { data }: { data: FormTemplate } = $props();
</script>

<Card.Root class="flex-column flex justify-between">
	<Card.Header>
		<Card.Title class="flex flex-row items-center gap-2">
			<LayoutTemplate size={16} />
			<span>{$t(`common.templates.${data.key}.name`)}</span>
		</Card.Title>
		<Card.Description>{$t(`common.templates.${data.key}.description`)}</Card.Description>
	</Card.Header>
	<Card.Footer class="align-items flex flex-row gap-2">
		<Button class="flex flex-row items-center gap-2">
			<FilePlus2 size={12} />
			<span>{$t('common.create')}</span>
		</Button>
		<Button variant="outline" class="flex flex-row items-center gap-2">
			<Eye size={12} />
			<span>{$t('common.view')}</span>
		</Button>
	</Card.Footer>
</Card.Root>
