<script lang="ts" generics="TData extends object">
	import { ChartType } from '$lib/enums/chart';
	import { Bar, BarChart, type BarChartProps, type SeriesData } from 'layerchart';
	import * as Chart from '../ui/chart/index';
	import type { Component, Snippet } from 'svelte';
	import * as Card from '../ui/card';
	import { LoaderCircle } from '@lucide/svelte';

	let {
		configuration,
		type,
		data,
		header,
		emptyState,
		props,
	}: {
		configuration: Chart.ChartConfig;
		type?: ChartType;
		data: TData[] | undefined;
		header?: Snippet;
		emptyState?: Snippet;
		props?: BarChartProps<TData>['props'];
	} = $props();

	const series = $derived.by(() => {
		const derivedSeries: SeriesData<TData, Component>[] = [];
		Object.keys(configuration ?? []).forEach((key) => {
			derivedSeries.push({
				key,
				label: configuration[key]?.label,
				color: configuration[key]?.color,
			});
		});
		return derivedSeries;
	});
	const y = $derived.by(() => {
		if (series.length === 1) return series[0].key;
		return undefined;
	});
	const seriesLayout = $derived.by(() => {
	  if (series.length > 1) return 'stack';
	});
	const axis = $derived.by(() => {
      return seriesLayout?.includes('stack') ? 'x' : undefined
	});
</script>

<Card.Root class={header ? 'pt-0' : ''}>
	{@render header?.()}
	<Card.Content>
		<Chart.Container config={configuration} class="min-h-50 w-full">
			{#if data === undefined || data === null}
				<div class="flex h-full items-center justify-center">
					<LoaderCircle size={24} class="text-primary animate-spin" />
				</div>
			{:else if (data.length === 0 && emptyState)}
			    {@render emptyState()}
			{:else if type === ChartType.Bar}
				{@render RenderBarChart()}
			{/if}
		</Chart.Container>
	</Card.Content>
</Card.Root>


{#snippet RenderBarChart()}
    <BarChart {data} x="x" {y} {axis} {series} {props} yNice legend={!!props?.legend} {seriesLayout}
		>{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
		{#snippet marks({ context })}
            {#each series as s, i (i)}
    			{#each data as d, i (i)}
         			<Bar
        				seriesKey={s.key}
                        rounded={series.length === 1 ? 'top' : undefined}
                        radius={series.length === 1 ? 8 : undefined}
        				motion="spring"
        				fill={'color' in d ? d.color as string : s.color}
        				data={d}
        				fillOpacity={0.8}
        				strokeWidth={0}
        				{...s.props}
         			/>
    			{/each}
            {/each}
		{/snippet}
	</BarChart>
{/snippet}
