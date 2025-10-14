<script lang="ts">
	import { t } from '$lib/i18n';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { Eye, Link, Trash2 } from '@lucide/svelte';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	import { getPublicFormLink, copyToClipboard } from '$lib/client/utils';
	import { toast } from 'svelte-sonner';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { type AppCustomEvent } from '$lib/models/common';
	let { data, onEvent }: { data: UserForm; onEvent: (event: AppCustomEvent<UserForm>) => void } =
		$props();

	function onCopy() {
		if (!data.public_link_identifier) return;
		const link = getPublicFormLink(data.public_link_identifier);
		copyToClipboard(link).then(() => {
			toast.success(t.get('common.link_copied_to_clipboard'));
		});
	}

	function onDelete() {
		onEvent({ type: AppCustomEventType.Delete, data });
	}
</script>

<Card.Root class="flex-column flex justify-between">
	<Card.Header>
		<Card.Title class="flex flex-row items-center gap-2">
			<span>{data.name}</span>
		</Card.Title>
		<Card.Description>{data.description}</Card.Description>
	</Card.Header>
	<Card.Footer class="align-items flex flex-row gap-2">
		<Button class="flex flex-row items-center gap-2" onclick={onCopy}>
			<Link size={12} />
			<span>{$t('common.copy_link')}</span>
		</Button>
		<Button variant="outline" class="flex flex-row items-center gap-2">
			<Eye size={12} />
			<span>{$t('common.view')}</span>
		</Button>
		<Button variant="destructive" class="flex flex-row items-center gap-2" onclick={onDelete}>
			<Trash2 size={12} />
			<span>{$t('common.delete')}</span>
		</Button>
	</Card.Footer>
</Card.Root>
