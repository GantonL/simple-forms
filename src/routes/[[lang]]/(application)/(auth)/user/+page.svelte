<script lang="ts">
	import { page } from '$app/state';
	import { DELETE } from '$lib/api/helpers/request';
	import AppAlertDialog from '$lib/components/app-alert-dialog/app-alert-dialog.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import DangerZone from '$lib/components/danger-zone/danger-zone.svelte';
	import { Button } from '$lib/components/ui/button';
	import UserProfileCard from '$lib/components/user-profile-card/user-profile-card.svelte';
	import UserSubscriptionCard from '$lib/components/user-subscription-card/user-subscription-card.svelte';
	import { t } from '$lib/i18n';
	import type { User } from 'better-auth';
	import { PaymentsSubscription } from '../../../../api';
	import { toast } from 'svelte-sonner';
	import AppDataTable from '$lib/components/app-data-table/app-data-table.svelte';
	import { invoicesTable } from './configurations';
	import { Shredder } from '@lucide/svelte';
	let user: User = $derived(page.data.user);
	let subscription = $derived(page.data.subscription);
	let alertCancelSubscription = $state(false);
	let cancelSubscriptionInProgress = $state(false);
	let invoices = $derived(page.data.invoices);

	async function onCancelSubscription() {
		cancelSubscriptionInProgress = true;
		const cancelRes = await DELETE<unknown, { cancelled: unknown }>(
			PaymentsSubscription(subscription.id),
			{}
		);
		cancelSubscriptionInProgress = false;
		const cancelled = cancelRes?.cancelled;
		if (cancelled) {
			toast.success(t.get('common.subscriptions_cancelled_success'));
			alertCancelSubscription = false;
		} else {
			toast.error(t.get('common.subscriptions_cancelled_failed'));
		}
	}

	function onInvoicesTablesPageSizeChanged() {}
	function onInvoicesTablesPageIndexChanged() {}
</script>

<BasePage title={user.name ?? 'common.user'} description="seo.pages.user.description">
	<div class="flex w-full items-center justify-center">
		<div class="flex w-full max-w-lg flex-col items-center justify-center gap-4">
			<UserProfileCard {user} />
			<UserSubscriptionCard {subscription} />
			<AppDataTable
				data={invoices}
				columns={invoicesTable.columns}
				configuration={invoicesTable.configuration}
				pageSizeChanged={onInvoicesTablesPageSizeChanged}
				pageIndexChanged={onInvoicesTablesPageIndexChanged}
			></AppDataTable>
			<DangerZone class="w-full">
				<Button
					class="flex flex-row gap-2"
					variant="destructive"
					disabled={subscription?.cancelled_at}
					onclick={() => (alertCancelSubscription = true)}
				>
					<Shredder />
					<span>{$t('common.cancel_subscription')}</span>
				</Button>
			</DangerZone>
		</div>
	</div>
</BasePage>

<AppAlertDialog
	title="common.are_you_sure"
	description="common.cancel_subscription_confirm_message"
	bind:open={alertCancelSubscription}
	cancel={{ title: 'common.no', disabled: cancelSubscriptionInProgress }}
	action={{
		title: 'common.yes',
		class: 'bg-destructive/30 text-destructive hover:text-foreground',
		disabled: cancelSubscriptionInProgress
	}}
	onAction={onCancelSubscription}
></AppAlertDialog>
