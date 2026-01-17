<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import Search from '@lucide/svelte/icons/search';

	let {
		placeholder,
		value = $bindable(''),
		onSearch
	}: {
		placeholder?: string;
		value?: string;
		onSearch?: (val: string) => void;
	} = $props();

	let timer: ReturnType<typeof setTimeout>;

	function handleInput() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onSearch?.(value);
		}, 250);
	}
</script>

<div class="relative flex flex-grow items-center border rounded-md">
	<Search
		class="absolute h-4 w-4 text-muted-foreground {$direction === 'lr' ? 'left-2.5' : 'right-2.5'}"
	/>
	<Input
		type="search"
		placeholder={$t(placeholder ?? 'common.search')}
		class="w-full {$direction === 'lr' ? 'pl-8' : 'pr-8'}"
		bind:value
		oninput={() => handleInput()}
	/>
</div>
