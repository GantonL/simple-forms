<script lang="ts">
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import * as AlertDialog from '../ui/alert-dialog';

	interface Action {
		title?: string;
		class?: string;
		disabled?: boolean;
	}
	interface Props {
		title: string;
		description: string;
		open: boolean;
		cancel?: Action;
		action?: Action;
		onAction?: () => void;
	}

	let { title, description, open = $bindable(false), cancel, action, onAction }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<div dir={$direction === 'lr' ? 'ltr' : 'rtl'} class="flex flex-col gap-2">
			<h1 class="text-xl font-bold">{$t(title)}</h1>
			<p class="text-lg">{$t(description)}</p>
		</div>
		<div
			dir={$direction === 'lr' ? 'ltr' : 'rtl'}
			class="flex flex-row items-center justify-end gap-2"
		>
			{#if action}
				<AlertDialog.Action disabled={action.disabled} onclick={onAction} class={action.class}
					>{$t(action.title ?? 'common.confirm')}</AlertDialog.Action
				>
			{/if}
			{#if cancel}
				<AlertDialog.Cancel>{$t(cancel.title ?? 'common.cancel')}</AlertDialog.Cancel>
			{/if}
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
