<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '$lib/i18n';
	import ThemeSwitcher from '../theme-switcher/theme-switcher.svelte';
	import SidebarTrigger from '../ui/sidebar/sidebar-trigger.svelte';
	import * as Tooltip from '../ui/tooltip';
</script>

<header class="grid w-full grid-cols-2 border-b p-2">
	<div class="flex flex-row items-center gap-4">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<SidebarTrigger />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{$t('common.toggle_menu')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
		<h1>
			<a class="flex flex-row items-center gap-3 text-xl" href={resolve('/')}>
				<img class="h-10 w-10" src="/logo.svg" alt="Simple Forms Logo" />
				<span>{$t('common.brand.name')} </span>
			</a>
		</h1>
	</div>
	<div class="flex flex-row items-center justify-end gap-2">
		<ThemeSwitcher></ThemeSwitcher>
	</div>
</header>
