<script lang="ts">
	import { page } from '$app/state';
	import { DELETE } from '$lib/api/helpers/request';
	import AppAlertDialog from '$lib/components/app-alert-dialog/app-alert-dialog.svelte';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import DangerZone from '$lib/components/danger-zone/danger-zone.svelte';
	import { Button } from '$lib/components/ui/button';
	import UserProfileCard from '$lib/components/user-profile-card/user-profile-card.svelte';
	import type { Plans } from '$lib/enums/plans';
	import { t } from '$lib/i18n';
	import type { User } from 'better-auth';
	import { PaymentsSubscription } from '../../../../api';
	import { toast } from 'svelte-sonner';
	import * as Alert from '$lib/components/ui/alert';
	import { resolve } from '$app/paths';
	let user: User = $derived(page.data.user);
	let plan: Plans = $derived(page.data.plan);
	let subscription = $derived(page.data.subscription);
	let alertCancelSubscription = $state(false);
	let cancelSubscriptionInProgress = $state(false);
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
</script>

<BasePage title={user.name ?? 'common.user'} description="seo.pages.user.description">
	<div class="flex w-full max-w-lg flex-col items-center justify-center gap-4">
		<UserProfileCard {user} {plan} />
		{#if subscription?.cancelled_at}
			<Alert.Root class="border-amber-400 bg-amber-400/20">
				<Alert.Title
					>{$t('common.subscription_cancelled_at', {
						date: subscription.cancelled_at
					})}</Alert.Title
				>
				<Alert.Description
					><a class="underline underline-offset-1" href={resolve('/user/plan/renew')}
						>{$t('common.click_here_to_renew')}</a
					></Alert.Description
				>
			</Alert.Root>
		{/if}
		<DangerZone class="w-full">
			<Button
				variant="destructive"
				disabled={subscription?.cancelled_at}
				onclick={() => (alertCancelSubscription = true)}>{$t('common.cancel_subscription')}</Button
			>
		</DangerZone>
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
