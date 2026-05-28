<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { PricingPlan } from '$lib/client/configurations/pricing';
	import { locale, t } from '$lib/i18n';
	import { Check, BadgeCheck, X } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import type { Plans } from '$lib/enums/plans';
	import { GET } from '$lib/api/helpers/request';
	import { PaymentsGetCheckoutLink } from '../../../routes/api';

	let {
		plans,
		mounted = false,
		activePlan
	}: { plans: PricingPlan[]; mounted?: boolean; activePlan?: Plans } = $props();

	async function generateCheckoutLinkAndRedirect(plan: Plans) {
		const queryParams = new URLSearchParams({
			language: locale.get()
		});
		const checkouLinkRes = await GET<{ checkoutLink: string }>(
			`${PaymentsGetCheckoutLink(plan)}?${queryParams}`
		);

		if (!checkouLinkRes?.checkoutLink) {
			// error message
			return;
		}
		window.open(checkouLinkRes?.checkoutLink, '_blank');
	}
</script>

<section class="flex w-full flex-col gap-12">
	<div class="flex flex-col items-center gap-4 text-center">
		<h2 class="text-3xl font-bold tracking-tight md:text-5xl">
			{$t('landing.pricing.title')}
		</h2>
		<p class="text-muted-foreground max-w-2xl text-lg">
			{$t('landing.pricing.subtitle')}
		</p>
	</div>

	<div class="flex items-center justify-center">
		<div
			class="grid gap-8"
			style="grid-template-columns: repeat({plans.length}, minmax(0, 380px));"
		>
			{#each plans as plan, i (plan.id)}
				{#if mounted}
					<div in:fly={{ y: 20, duration: 500, delay: 200 + i * 100 }}>
						<Card.Root
							class="relative flex h-full flex-col {plan.highlighted
								? 'border-primary/40 shadow-primary/10 ring-primary shadow-xl ring-2'
								: 'border-muted/50'}"
						>
							{#if plan.badgeKey}
								<div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
									<Badge class="px-4 py-1 text-sm font-semibold">
										{$t(plan.badgeKey)}
									</Badge>
								</div>
							{/if}

							<Card.Header class="gap-4 pb-2">
								<div class="flex flex-col gap-1">
									<Card.Title class="text-2xl">{$t(plan.nameKey)}</Card.Title>
									<Card.Description class="text-base">
										{$t(plan.descriptionKey)}
									</Card.Description>
								</div>

								<div class="flex items-end gap-1">
									<span class="text-5xl font-extrabold tracking-tight">
										{plan.currency === 'USD' ? '$' : plan.currency}{plan.price}
									</span>
									<span class="text-muted-foreground mb-1.5">
										{$t('landing.pricing.per_month')}
									</span>
								</div>
							</Card.Header>

							<Card.Content class="flex flex-1 flex-col gap-6">
								<ul class="flex flex-col gap-3">
									{#each plan.features as feature (feature.labelKey)}
										<li class="flex items-center gap-3">
											{#if feature.included}
												<Check size={18} class="text-primary shrink-0" />
											{:else}
												<X size={18} class="text-muted-foreground shrink-0" />
											{/if}
											<span class={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
												{$t(feature.labelKey)}
											</span>
										</li>
									{/each}
								</ul>

								<div class="mt-auto pt-2">
									<Button
										class="w-full text-base font-semibold"
										size="lg"
										variant={plan.highlighted ? 'default' : 'outline'}
										onclick={() => generateCheckoutLinkAndRedirect(plan.id)}
										disabled={activePlan === plan.id}
									>
										{#if activePlan === plan.id}
											<BadgeCheck size={24} />
										{:else}
											{$t(plan.ctaLabelKey)}
										{/if}
									</Button>
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>
