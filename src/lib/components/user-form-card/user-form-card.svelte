<script lang="ts">
	import { locale, t } from '$lib/i18n';
	import type { UserForm } from '$lib/server/database/schemas/form';
	import { Copy, Link, LoaderCircle, X, Check, Signature, PowerOff } from '@lucide/svelte';
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
	import * as Dialog from '../ui/dialog';
	import { Badge } from '../ui/badge';
	import * as Tooltip from '../ui/tooltip';
	let { data, onEvent }: { data: UserForm; onEvent: (event: AppCustomEvent<UserForm>) => void } =
		$props();
	let copyDialogOpenInProgress = $state(false);
	let copyLink = $state('');
	let copiedSuccess = $state(false);
	let copiedError = $state(false);
	let openCopyLinkDialog = $state(false);

	async function onCopy(event: Event) {
		event.stopImmediatePropagation();
		copyDialogOpenInProgress = true;
		if (!data.public_link_identifier) return;
		copyLink = await GET<string>(`${UsersForms}/${data.id}/public-link`);
		openCopyLinkDialog = true;
		copyDialogOpenInProgress = false;
	}

	function executeCopy() {
		copyToClipboard(copyLink)
			.then(() => {
				toast.success(t.get('common.link_copied_to_clipboard'));
				copiedSuccess = true;
			})
			.catch(() => {
				toast.error(t.get('common.operation_failed'));
				copiedError = true;
			});
	}

	function onOpen() {
		onEvent?.({ type: AppCustomEventType.Open, data });
	}

	function onDialogOpenComplete() {
		copiedError = false;
		copiedSuccess = false;
	}
</script>

<button class="hover:cursor-pointer" onclick={onOpen}>
	<Card.Root
		class="relative flex flex-col justify-between overflow-hidden {data.is_active === false
			? 'opacity-60'
			: ''}"
	>
		{#if data.is_active === false}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
				<PowerOff size={100} />
			</div>
		{/if}
		<Card.Header class="flex flex-row justify-between">
			<div class="flex flex-col items-start gap-2">
				<Card.Title class="flex flex-row items-center gap-2">
					<span>{data.name}</span>
				</Card.Title>
				<Card.Description>{data.description}</Card.Description>
			</div>
			{#if data.is_active !== false}
				<Badge variant="secondary" class="bg-secondary/35">
					<Signature size={12} />
					{data.submissions}
				</Badge>
			{/if}
			<Menu
				configuration={menuConfiguration}
				rawData={data}
				event={(e) => onEvent({ type: e.type as AppCustomEventType, data })}
			/>
		</Card.Header>
		<Card.Footer class="align-items flex flex-row justify-between gap-2">
			{@render copyLinkButton()}
			<span class="text-muted-foreground text-xs italic"
				>{$t('common.last_signed_at_x', {
					date: Intl.DateTimeFormat(locale.get()).format(new Date(data.updatedAt))
				})}</span
			>
		</Card.Footer>
	</Card.Root>
</button>

<Dialog.Root bind:open={openCopyLinkDialog} onOpenChangeComplete={onDialogOpenComplete}>
	<Dialog.Content>
		<Dialog.Title><h2 class="p-2">{$t('common.copy_link')}</h2></Dialog.Title>
		<div class="flex flex-row items-center gap-2 rounded-md border p-2 shadow-md" dir="ltr">
			<p class="break-all">{copyLink}</p>
			<Button variant="ghost" size="icon" onclick={executeCopy}>
				{#if copiedError}
					<X size={14} class="text-destructive" />
				{:else if copiedSuccess}
					<Check size={14} class="text-primary" />
				{:else}
					<Copy size={14} />
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

{#snippet copyLinkButton()}
	{@const disabledInProgress = copyDialogOpenInProgress}
	{@const disabledNotActive = data.is_active === false}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button
				class="flex flex-row items-center gap-2"
				onclick={onCopy}
				disabled={disabledInProgress || disabledNotActive}
			>
				{#if copyDialogOpenInProgress}
					<LoaderCircle size={12} class="animate-spin" />
				{:else}
					<Link size={12} />
				{/if}
				<span>{$t('common.copy_link')}</span>
			</Button>
		</Tooltip.Trigger>
		{#if disabledNotActive}
			<Tooltip.Content>
				{$t('common.form_disabled_copy_link_tooltip')}
			</Tooltip.Content>
		{/if}
	</Tooltip.Root>
{/snippet}
