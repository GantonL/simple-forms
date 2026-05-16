<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import UserProfileCard from '$lib/components/user-profile-card/user-profile-card.svelte';
	import type { Plans } from '$lib/enums/plans';
	import type { User } from 'better-auth';
	let user: User = $derived(page.data.user);
	let plan: Plans = $derived(page.data.plan);
</script>

<BasePage title={user.name ?? 'common.user'} description="seo.pages.user.description">
	<div class="flex w-full items-center justify-center">
		<UserProfileCard {user} {plan} />
	</div>
</BasePage>
