<script lang="ts">
	import { page } from '$app/state';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import UserProfileCard from '$lib/components/user-profile-card/user-profile-card.svelte';
	import type { User } from 'better-auth';
	let user: User = $derived(page.data.user);
</script>

<BasePage title={user.name ?? 'common.user'} description="seo.pages.user.description">
	<UserProfileCard {user} />
</BasePage>
