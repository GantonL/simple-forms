<script lang="ts">
	import { t } from '$lib/i18n';
	import type { FormTemplate } from '$lib/server/database/schemas/form';
	import { FilePlusCorner, LayoutTemplate, Share } from '@lucide/svelte';
	import { Badge } from '../ui/badge';
	import * as Card from '../ui/card';
	import Button from '../ui/button/button.svelte';
	import { type AppCustomEvent } from '$lib/models/common';
	import { AppCustomEventType } from '$lib/enums/app-custom-event-type';
	import SchemaSkeletonPreview from '../schema-skeleton-preview/schema-skeleton-preview.svelte';

	let {
		data,
		onEvent
	}: { data: FormTemplate; onEvent: (event: AppCustomEvent<FormTemplate>) => void } = $props();

	function onCreate() {
		onEvent({ type: AppCustomEventType.Create, data });
	}

	function onPublish() {
		onEvent({ type: AppCustomEventType.Publish, data });
	}
</script>

<Card.Root class="flex flex-col">
	<Card.Header>
		<Card.Title class="flex flex-row items-center gap-2">
			<LayoutTemplate size={16} />
			<span>{data.key ? $t(`common.templates.${data.key}.name`) : (data.schema as any)?.name || 'Custom Template'}</span>
			{#if data.is_community}
				<Badge variant="secondary" class="ml-2">{$t('common.templates.community') || 'Community'}</Badge>
			{/if}
		</Card.Title>
		<Card.Description>
			{data.key ? $t(`common.templates.${data.key}.description`) : (data.schema as any)?.description || 'User created template'}
		</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-1 flex-col items-end justify-end px-6">
		<SchemaSkeletonPreview schema={data.schema} class="max-w-24" />
	</Card.Content>
	<Card.Footer class="flex flex-row gap-2 justify-between">
		<Button class="flex flex-row items-center gap-2" onclick={onCreate}>
			<FilePlusCorner size={12} />
			<span>{$t('common.form_builder.create_form')}</span>
		</Button>
		{#if data.user_id && !data.is_community}
			<Button variant="secondary" class="flex flex-row items-center gap-2" onclick={onPublish}>
				<Share size={12} />
				<span>{$t('common.publish') || 'Publish'}</span>
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
