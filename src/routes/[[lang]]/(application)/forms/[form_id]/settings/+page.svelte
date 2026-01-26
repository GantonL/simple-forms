<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { t } from '$lib/i18n';
	import { NOTIFICATIONS } from '$lib/models/workflows';
	import type { FormSettingsSelect } from '$lib/server/database/schemas/form';
	import { toast } from 'svelte-sonner';

	const settings: FormSettingsSelect = $state(page.data.settings);
	const availableNotifications = Object.values(NOTIFICATIONS);
	settings.notifications = {
		[NOTIFICATIONS.FORM_SIGNED]: {
			enabled: (settings.notifications ?? {})[NOTIFICATIONS.FORM_SIGNED]?.enabled ?? false
		}
	};

	function onNotificationCheckedChanged(notificationType: NOTIFICATIONS) {
		console.log(settings.notifications![notificationType].enabled);
		// update form settings notifications with new value
		toast.success(
			t.get(`common.notification_x_updated_succssfuly`, {
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
			/>
			<Label for={notification}>{$t(`common.notifications_per_type.${notification}.label`)}</Label>
		</div>
		<p class="text-sm italic">{$t(`common.notifications_per_type.${notification}.description`)}</p>
	</div>
{/snippet}
