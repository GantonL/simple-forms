<script lang="ts">
	import { t } from '$lib/i18n';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { File, Link, LoaderCircle } from '@lucide/svelte';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	import { copyToClipboard } from '$lib/client/utils';
	import { toast } from 'svelte-sonner';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import { type AppCustomEvent } from '$lib/models/common';
	import Menu from '../menu/menu.svelte';
	import { menuConfiguration } from './configurations/menu';
	import { GET } from '$lib/api/helpers/request';
	import { UsersForms } from '../../../routes/api';
	let { data, onEvent }: { data: UserForm; onEvent: (event: AppCustomEvent<UserForm>) => void } =
		$props();
	let copyInProgress = $state(false);

	async function onCopy(event: Event) {
		event.stopImmediatePropagation();
		copyInProgress = true;
		if (!data.public_link_identifier) return;
		const link = await GET<string>(`${UsersForms}/${data.id}/public-link`);
		copyToClipboard(link)
			.then(() => {
				toast.success(t.get('common.link_copied_to_clipboard'));
			})
			.catch(() => {
				toast.error(t.get('common.operation_failed'));
			});
		copyInProgress = false;
	}

	function onOpen() {
		onEvent?.({ type: AppCustomEventType.Open, data });
	}
</script>

<button class="hover:cursor-pointer" onclick={onOpen}>
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
			<Button class="flex flex-row items-center gap-2" onclick={onCopy} disabled={copyInProgress}>
				{#if copyInProgress}
					<LoaderCircle size={12} class="animate-spin" />
				{:else}
					<Link size={12} />
				{/if}
				<span>{$t('common.copy_link')}</span>
			</Button>
		</Card.Footer>
	</Card.Root>
</button>
