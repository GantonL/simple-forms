<script>
	let { children } = $props();
</script>

<article
	class="prose prose-strong:text-secondary-foreground prose-a:text-secondary-foreground prose-headings:text-secondary-foreground text-secondary-foreground text-justify"
>
	{@render children?.()}
</article>
