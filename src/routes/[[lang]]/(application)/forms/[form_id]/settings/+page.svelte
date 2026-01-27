<script lang="ts">
	import { page } from '$app/state';
	import { PUT } from '$lib/api/helpers/request';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { t } from '$lib/i18n';
	import { NOTIFICATIONS } from '$lib/models/workflows';
	import type { FormSettingsSelect } from '$lib/server/database/schemas/form';
	import { toast } from 'svelte-sonner';
	import { UsersForms } from '../../../../../api';

	const settings: FormSettingsSelect = $state(page.data.settings);
	const availableNotifications = Object.values(NOTIFICATIONS);
	settings.notifications = {
		[NOTIFICATIONS.FORM_SIGNED]: {
			enabled: (settings.notifications ?? {})[NOTIFICATIONS.FORM_SIGNED]?.enabled ?? false
		}
	};

	async function onNotificationCheckedChanged(notificationType: NOTIFICATIONS) {
		const updatedRes = await PUT<
			Pick<FormSettingsSelect, 'notifications'>,
			unknown,
			{ updated: FormSettingsSelect[] }
		>(
			`${UsersForms}/${settings.user_form_id}/settings`,
			{ notifications: settings.notifications },
			{},
			{
				fetch
			}
		);
		const success = !!updatedRes?.updated;
		toast[success ? 'success' : 'error'](
			t.get(`common.notification_x_updated_${success ? 'successfully' : 'failed'}`, {
				notification: t.get(`common.notifications_per_type.${notificationType}.label`)
			})
		);
	}
</script>

<BasePage title="common.forms" description="seo.pages.form_detail.description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.form_settings')}</h2>
	{/snippet}
	<Card.Root>
		<Card.Header>
			<Card.Title>{$t('common.notifications')}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="ga-4 flex flex-col">
				{#each availableNotifications as notification (notification)}
					{@render Notification(notification)}
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</BasePage>

{#snippet Notification(notification: NOTIFICATIONS)}
	<div class="flex flex-col gap-2">
		<div class="flex gap-2">
			<Switch
				id={notification}
				bind:checked={settings.notifications![notification].enabled}
				onCheckedChange={() => onNotificationCheckedChanged(notification)}
				class="cursor-pointer"
			/>
			<Label for={notification}>{$t(`common.notifications_per_type.${notification}.label`)}</Label>
		</div>
		<p class="text-sm italic">{$t(`common.notifications_per_type.${notification}.description`)}</p>
	</div>
{/snippet}
