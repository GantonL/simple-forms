<script lang="ts">
	import { t } from '$lib/i18n';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { File, Link } from '@lucide/svelte';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	import { getPublicFormLink, copyToClipboard } from '$lib/client/utils';
	import { toast } from 'svelte-sonner';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { type AppCustomEvent } from '$lib/models/common';
	import Menu from '../menu/menu.svelte';
	import { menuConfiguration } from './configurations/menu';
	let { data, onEvent }: { data: UserForm; onEvent: (event: AppCustomEvent<UserForm>) => void } =
		$props();

	function onCopy() {
		if (!data.public_link_identifier) return;
		const link = getPublicFormLink(data.public_link_identifier);
		copyToClipboard(link).then(() => {
			toast.success(t.get('common.link_copied_to_clipboard'));
		});
	}

	function onOpen() {
		onEvent?.({ type: AppCustomEventType.View, data });
	}
</script>

<Card.Root class="flex-column flex justify-between">
	<Card.Header class="flex flex-row justify-between">
		<div class="flex flex-col items-start gap-2">
			<Card.Title class="flex flex-row items-center gap-2">
				<span>{data.name}</span>
			</Card.Title>
			<Card.Description>{data.description}</Card.Description>
		</div>
		<Menu
			configuration={menuConfiguration}
			rawData={data}
			event={(e) => onEvent({ type: e.type as AppCustomEventType, data })}
		/>
	</Card.Header>
	<Card.Footer class="align-items flex flex-row gap-2">
		<Button class="flex flex-row items-center gap-2" onclick={onCopy}>
			<Link size={12} />
			<span>{$t('common.copy_link')}</span>
		</Button>
		<Button variant="secondary" class="flex flex-row items-center gap-2" onclick={onOpen}>
			<File size={12} />
			<span>{$t('common.open')}</span>
		</Button>
	</Card.Footer>
</Card.Root>
