<script lang="ts">
	import { onMount } from 'svelte';
	let { value, id, placeholder } = $props();

	onMount(() => {});
</script>

<div id={`${id}`}></div>
