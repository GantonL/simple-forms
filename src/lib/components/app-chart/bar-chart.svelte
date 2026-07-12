<script lang="ts">
	import AppChart from './app-chart.svelte';
	import { type ChartConfig } from '../ui/chart';
	import type { BarChartData } from '$lib/models/chart';
	import { ChartType } from '$lib/enums/chart';
	import type { Snippet } from 'svelte';
	import type { BarChartProps } from 'layerchart';

	let {
		data,
		configuration,
		header,
		emptyState,
		props
	}: {
		data: BarChartData[] | undefined;
		configuration: ChartConfig;
		header?: Snippet;
		emptyState?: Snippet;
		props?: BarChartProps<BarChartData>['props'];
	} = $props();
</script>

<AppChart {data} {configuration} type={ChartType.Bar} {header} {emptyState} {props}></AppChart>
