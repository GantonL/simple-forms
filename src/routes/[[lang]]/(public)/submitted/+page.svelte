<script>
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import { CheckCircle } from '@lucide/svelte';
</script>

<BasePage title="common.forms" description="seo.pages.submitted.description">
	<div class="mt-[5%] flex flex-col items-center">
		<Card.Root>
			<Card.Header>
				<div class="flex flex-col items-center justify-center gap-4">
					<CheckCircle size={24} class="text-primary" />
					{$t('common.thank_you')}
				</div>
			</Card.Header>
			<Card.Content>
				{$t('common.form_submited_successfuly')}
			</Card.Content>
		</Card.Root>
	</div>
</BasePage>
