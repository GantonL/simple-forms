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
	<AlertDialog.Content dir={$direction === 'lr' ? 'ltr' : 'rtl'}>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t(title)}</AlertDialog.Title>
			<AlertDialog.Description>{$t(description)}</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			{#if cancel}
				<AlertDialog.Cancel>{$t(cancel.title ?? 'common.cancel')}</AlertDialog.Cancel>
			{/if}
			{#if action}
				<AlertDialog.Action disabled={action.disabled} onclick={onAction} class={action.class}
					>{$t(action.title ?? 'common.confirm')}</AlertDialog.Action
				>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
