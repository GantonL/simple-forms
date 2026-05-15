<script lang="ts">
	import Avatar from '$lib/components/avatar/avatar.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { t } from '$lib/i18n';
	import { CircleCheck, CircleX } from '@lucide/svelte';

	let { user } = $props();
</script>

<Card.Root class="w-full max-w-lg">
	<Card.Header class="flex flex-col items-center pb-4 text-center">
		<Avatar styleClass="h-18 w-18" src={user.image} size={120} />
		<Card.Title class="mt-2 text-2xl">{user.name}</Card.Title>
		<Card.Description>{user.email}</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4">
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground text-sm font-medium">{$t('common.plan')}</span>
				<Badge variant="secondary">{$t(`common.plans.${user.plan_id}.name`)}</Badge>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-muted-foreground text-sm font-medium">{$t('common.license')}</span>
				{#if user.license_id}
					<Tooltip.Root>
						<Tooltip.Trigger>
							<span class="font-mono text-sm">{user.license_id}</span>
						</Tooltip.Trigger>
						<Tooltip.Content>
							{$t('common.license_id_tooltip', { id: user.license_id })}
						</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<span class="text-muted-foreground text-sm">{$t('common.unknown')}</span>
				{/if}
			</div>
		</div>

		<Separator />

		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<span class="text-muted-foreground text-sm font-medium">{$t('common.email_verified')}</span>
				{#if user.emailVerified}
					<CircleCheck class="text-green-500" size={18} />
				{:else}
					<CircleX class="text-destructive" size={18} />
				{/if}
			</div>

			<div class="flex items-center justify-between">
				<span class="text-muted-foreground text-sm font-medium">{$t('common.created_at')}</span>
				<span class="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-muted-foreground text-sm font-medium">{$t('common.last_updated')}</span>
				<span class="text-sm">{new Date(user.updatedAt).toLocaleDateString()}</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>
