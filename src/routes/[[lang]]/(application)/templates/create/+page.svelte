<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import TemplateBuilder from '$lib/components/template-builder/template-builder.svelte';
	import { t } from '$lib/i18n';
</script>

<BasePage title="common.template_builder.title" description="common.template_builder.description">
	{#snippet header()}
		<h2 class="text-2xl font-bold">{$t('common.template_builder.title')}</h2>
		<p class="text-lg font-light">{$t('common.template_builder.description')}</p>
	{/snippet}
	<TemplateBuilder />
</BasePage>
