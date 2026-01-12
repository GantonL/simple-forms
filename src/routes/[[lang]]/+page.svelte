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
		Shield
	} from '@lucide/svelte';

	function handleGetStarted() {
		goto(resolve('/signup'));
	}

	function handleViewTemplates() {
		goto(resolve('/templates'));
	}

	const features = [
		{
			title: 'landing.features.template_based.title',
			description: 'landing.features.template_based.description',
			icon: FileText
		},
		{
			title: 'landing.features.instant_sharing.title',
			description: 'landing.features.instant_sharing.description',
			icon: Share2
		},
		{
			title: 'landing.features.signature_collection.title',
			description: 'landing.features.signature_collection.description',
			icon: FileCheck
		},
		{
			title: 'landing.features.real_time_tracking.title',
			description: 'landing.features.real_time_tracking.description',
			icon: Activity
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
	<div class="flex justify-center">
		<div class="flex w-full max-w-6xl flex-col gap-16">
			<!-- Hero Section -->
			<section class="flex flex-col items-center gap-6 py-12 text-center">
				<h1 class="text-5xl font-bold tracking-tight max-md:text-4xl">
					{$t('landing.hero.headline')}
				</h1>
				<p class="text-muted-foreground max-w-2xl text-xl">
					{$t('landing.hero.subheadline')}
				</p>
				<div class="flex flex-row gap-4 max-sm:w-full max-sm:flex-col">
					<Button size="lg" onclick={handleGetStarted} class="transition-all hover:scale-105">
						{$t('landing.hero.cta_primary')}
					</Button>
					<Button
						size="lg"
						variant="outline"
						onclick={handleViewTemplates}
						class="transition-all hover:scale-105"
					>
						{$t('landing.hero.cta_secondary')}
					</Button>
				</div>
			</section>

			<!-- Features Section -->
			<section class="flex flex-col gap-8">
				<div class="flex flex-col gap-2 text-center">
					<h2 class="text-3xl font-bold">{$t('landing.features.title')}</h2>
					<p class="text-muted-foreground text-lg">{$t('landing.features.subtitle')}</p>
				</div>
				<div class="grid grid-cols-2 gap-6 max-md:grid-cols-1">
					{#each features as feature (feature.title)}
						<Card.Root class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
							<Card.Header>
								<div class="flex items-center gap-3">
									<div
										class="bg-primary/10 text-primary rounded-lg p-2 transition-transform duration-300 hover:scale-110"
									>
										<svelte:component this={feature.icon} size={24} />
									</div>
									<Card.Title>{$t(feature.title)}</Card.Title>
								</div>
							</Card.Header>
							<Card.Content>
								<p class="text-muted-foreground">{$t(feature.description)}</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</section>

			<!-- How It Works Section -->
			<section class="flex flex-col gap-8">
				<div class="flex flex-col gap-2 text-center">
					<h2 class="text-3xl font-bold">{$t('landing.how_it_works.title')}</h2>
					<p class="text-muted-foreground text-lg">{$t('landing.how_it_works.subtitle')}</p>
				</div>
				<div class="grid grid-cols-3 gap-6 max-md:grid-cols-1">
					{#each steps as step (step.number)}
						<div class="group flex flex-col items-center gap-4 text-center">
							<div
								class="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
							>
								{step.number}
							</div>
							<h3
								class="group-hover:text-primary text-xl font-semibold transition-colors duration-300"
							>
								{$t(step.title)}
							</h3>
							<p class="text-muted-foreground">{$t(step.description)}</p>
						</div>
					{/each}
				</div>
			</section>

			<!-- Benefits Section -->
			<section class="flex flex-col gap-8">
				<div class="flex flex-col gap-2 text-center">
					<h2 class="text-3xl font-bold">{$t('landing.benefits.title')}</h2>
				</div>
				<div class="grid grid-cols-2 gap-6 max-md:grid-cols-1">
					{#each benefits as benefit (benefit.title)}
						<Card.Root class="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
							<Card.Header>
								<div class="flex items-center gap-3">
									<div
										class="bg-primary/10 text-primary rounded-lg p-2 transition-transform duration-300 hover:scale-110 hover:rotate-6"
									>
										<svelte:component this={benefit.icon} size={24} />
									</div>
									<Card.Title>{$t(benefit.title)}</Card.Title>
								</div>
							</Card.Header>
							<Card.Content>
								<p class="text-muted-foreground">{$t(benefit.description)}</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</section>

			<!-- Final CTA Section -->
			<section
				class="bg-muted flex flex-col items-center gap-6 rounded-lg p-12 text-center transition-all duration-300 hover:shadow-xl"
			>
				<h2 class="text-3xl font-bold">{$t('landing.final_cta.title')}</h2>
				<p class="text-muted-foreground max-w-2xl text-lg">
					{$t('landing.final_cta.description')}
				</p>
				<Button size="lg" onclick={handleGetStarted} class="transition-all hover:scale-105">
					{$t('landing.final_cta.button')}
				</Button>
			</section>
		</div>
	</div>
</BasePage>
