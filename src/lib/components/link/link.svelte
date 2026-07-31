<script lang="ts">
	import { resolve } from '$app/paths';
	import { defaultLocale } from '$lib/api/configurations/common';
	import { locale, t } from '$lib/i18n';
	import type { Link } from '$lib/models/link';
	import type { Snippet } from 'svelte';

	interface Props {
		link: Link;
		class?: string;
		children?: Snippet;
	}

	let {
		link,
		class: className = 'text-muted-foreground hover:text-foreground transition-colors cursor-pointer',
		children,
	}: Props = $props();
</script>

<a
	href={resolve(`${$locale === defaultLocale ? '' : `/${$locale}`}${link.path}`)}
	class={className}
>
    {#if children}
        {@render children()}
    {:else}
    	<div class="flex flex-row items-center gap-2">
    		{#if link.icon}
    			<link.icon />
    		{/if}
    		<span class="hover:underline-offset-1">{$t(link.label, { ...link.labelParams })}</span>
    	</div>
    {/if}
</a>
