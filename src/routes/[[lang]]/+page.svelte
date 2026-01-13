<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { t } from '$lib/i18n';
	import {
		FileText,
		Share2,
		FileCheck,
		Activity,
		UserCheck,
		Clock,
		FolderOpen,
		Shield,
		ArrowRight
	} from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	function handleGetStarted() {
		goto(resolve('/signup'));
	}

	function handleViewTemplates() {
		goto(resolve('/templates'));
	}

	// Animation State
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	const features = [
		{
			title: 'landing.features.template_based.title',
			description: 'landing.features.template_based.description',
			icon: FileText,
			color: 'text-blue-500',
			bg: 'bg-blue-500/10'
		},
		{
			title: 'landing.features.instant_sharing.title',
			description: 'landing.features.instant_sharing.description',
			icon: Share2,
			color: 'text-green-500',
			bg: 'bg-green-500/10'
		},
		{
			title: 'landing.features.signature_collection.title',
			description: 'landing.features.signature_collection.description',
			icon: FileCheck,
			color: 'text-purple-500',
			bg: 'bg-purple-500/10'
		},
		{
			title: 'landing.features.real_time_tracking.title',
			description: 'landing.features.real_time_tracking.description',
			icon: Activity,
			color: 'text-orange-500',
			bg: 'bg-orange-500/10'
		}
	];

	const steps = [
		{
			title: 'landing.how_it_works.step1.title',
			description: 'landing.how_it_works.step1.description',
			number: '1'
		},
		{
			title: 'landing.how_it_works.step2.title',
			description: 'landing.how_it_works.step2.description',
			number: '2'
		},
		{
			title: 'landing.how_it_works.step3.title',
			description: 'landing.how_it_works.step3.description',
			number: '3'
		}
	];

	const benefits = [
		{
			title: 'landing.benefits.no_account.title',
			description: 'landing.benefits.no_account.description',
			icon: UserCheck
		},
		{
			title: 'landing.benefits.save_time.title',
			description: 'landing.benefits.save_time.description',
			icon: Clock
		},
		{
			title: 'landing.benefits.organized.title',
			description: 'landing.benefits.organized.description',
			icon: FolderOpen
		},
		{
			title: 'landing.benefits.compliant.title',
			description: 'landing.benefits.compliant.description',
			icon: Shield
		}
	];
</script>

<BasePage title="common.brand.name" description="seo.pages.home.description">
	<!-- Background Pattern -->
	<div class="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
		<div
			class="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
		></div>
		<div
			class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"
		></div>
	</div>

	<div class="flex justify-center overflow-hidden px-4">
		<div class="flex w-full max-w-6xl flex-col gap-24 pb-20 pt-10 md:gap-32 md:pt-20">
			<!-- Hero Section -->
			<section class="relative flex flex-col items-center gap-8 text-center">
				{#if mounted}
					<div
						in:fly={{ y: 20, duration: 800, delay: 0, easing: cubicOut }}
						class="flex flex-col items-center gap-6"
					>
						<h1
							class="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
						>
							<span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								{$t('landing.hero.headline')}
							</span>
						</h1>

						<p class="max-w-2xl text-xl text-muted-foreground md:text-2xl">
							{$t('landing.hero.subheadline')}
						</p>

						<div class="mt-4 flex flex-col gap-4 sm:flex-row">
							<Button
								size="lg"
								onclick={handleGetStarted}
								class="h-12 px-8 text-lg font-semibold shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/25"
							>
								{$t('landing.hero.cta_primary')}
								<ArrowRight class="ml-2 h-5 w-5" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								onclick={handleViewTemplates}
								class="h-12 px-8 text-lg hover:bg-secondary/50"
							>
								{$t('landing.hero.cta_secondary')}
							</Button>
						</div>
					</div>
				{/if}
			</section>

			<!-- Features Section -->
			<section class="flex flex-col gap-12">
				<div class="flex flex-col items-center gap-4 text-center">
					<h2 class="text-3xl font-bold tracking-tight md:text-5xl">
						{$t('landing.features.title')}
					</h2>
					<p class="max-w-2xl text-lg text-muted-foreground">
						{$t('landing.features.subtitle')}
					</p>
				</div>
				
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
					{#each features as feature, i (feature.title)}
						{#if mounted}
							<div in:fly={{ y: 20, duration: 500, delay: 200 + i * 100 }}>
								<Card.Root
									class="group h-full border-muted/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
								>
									<Card.Header>
										<div class="flex items-start gap-4">
											<div
												class="{feature.bg} {feature.color} rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
											>
												<svelte:component this={feature.icon} size={28} />
											</div>
											<div class="flex flex-col gap-1">
												<Card.Title class="text-xl">{$t(feature.title)}</Card.Title>
												<Card.Description class="text-base">
													{$t(feature.description)}
												</Card.Description>
											</div>
										</div>
									</Card.Header>
								</Card.Root>
							</div>
						{/if}
					{/each}
				</div>
			</section>

			<!-- How It Works Section -->
			<section
				class="relative overflow-hidden rounded-3xl border bg-muted/30 px-6 py-16 md:px-12"
			>
				<div
					class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
				></div>
				
				<div class="flex flex-col gap-12">
					<div class="flex flex-col items-center gap-4 text-center">
						<h2 class="text-3xl font-bold tracking-tight md:text-5xl">
							{$t('landing.how_it_works.title')}
						</h2>
						<p class="max-w-2xl text-lg text-muted-foreground">
							{$t('landing.how_it_works.subtitle')}
						</p>
					</div>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
						{#each steps as step, i (step.number)}
							{#if mounted}
								<div
									in:fly={{ y: 20, duration: 500, delay: 400 + i * 150 }}
									class="group relative flex flex-col items-center gap-6 text-center"
								>
									<!-- Connector Line (Desktop) -->
									{#if i !== steps.length - 1}
										<div
											class="absolute top-8 -z-10 hidden h-[2px] w-[calc(100%+2rem)] bg-border ltr:left-[50%] rtl:right-[50%] md:block"
										></div>
									{/if}

									<div
										class="flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-lg ring-1 ring-border transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/20 group-hover:ring-primary"
									>
										<span class="text-2xl font-bold text-primary">{step.number}</span>
									</div>
									<div class="flex flex-col gap-2 bg-background/50 p-4 backdrop-blur-sm">
										<h3 class="text-xl font-bold group-hover:text-primary transition-colors">
											{$t(step.title)}
										</h3>
										<p class="text-muted-foreground">{$t(step.description)}</p>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</section>

			<!-- Benefits Section -->
			<section class="flex flex-col gap-12">
				<div class="flex flex-col items-center gap-4 text-center">
					<h2 class="text-3xl font-bold tracking-tight md:text-4xl">
						{$t('landing.benefits.title')}
					</h2>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
					{#each benefits as benefit, i (benefit.title)}
						{#if mounted}
							<div in:fly={{ y: 20, duration: 500, delay: 600 + i * 100 }}>
								<div
									class="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
								>
									<div class="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<svelte:component this={benefit.icon} size={24} />
									</div>
									<h3 class="text-xl font-bold">{$t(benefit.title)}</h3>
									<p class="text-muted-foreground">{$t(benefit.description)}</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</section>

			<!-- Final CTA Section -->
			<section>
				{#if mounted}
					<div
						in:fly={{ y: 40, duration: 800, delay: 800 }}
						class="relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground shadow-2xl md:px-12"
					>
						<div
							class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
						></div>
						<div
							class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
						></div>
						<div
							class="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
						></div>

						<h2 class="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
							{$t('landing.final_cta.title')}
						</h2>
						<p class="max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
							{$t('landing.final_cta.description')}
						</p>
						<Button
							size="lg"
							variant="secondary"
							onclick={handleGetStarted}
							class="h-14 px-8 text-lg font-semibold shadow-lg transition-transform hover:scale-105"
						>
							{$t('landing.final_cta.button')}
							<ArrowRight class="ml-2 h-5 w-5" />
						</Button>
					</div>
				{/if}
			</section>
		</div>
	</div>
</BasePage>
