<script lang="ts">
	import { t } from '$lib/i18n';
	import * as Card from '../ui/card';

	let { children, ...restProps } = $props();
</script>

<Card.Root class="border-destructive bg-destructive/20 {restProps?.class}">
	<Card.Header>
		<Card.Title>{$t('common.danger_zone')}</Card.Title>
	</Card.Header>
	<Card.Content>
		{@render children()}
	</Card.Content>
</Card.Root>
