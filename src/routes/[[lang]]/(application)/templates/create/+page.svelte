<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import TemplateBuilder from '$lib/components/template-builder/template-builder.svelte';
	import { t } from '$lib/i18n';
</script>

<BasePage title="common.create_template" description="common.create_templates_description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.create_template')}</h2>
		<p class="text-lg font-light">{$t('common.create_templates_description')}</p>
	{/snippet}
	<TemplateBuilder />
</BasePage>
