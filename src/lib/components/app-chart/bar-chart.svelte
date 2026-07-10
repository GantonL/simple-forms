<script lang="ts">
	import AppChart from './app-chart.svelte';
	import { type ChartConfig } from '../ui/chart';
	import type { BarChartData } from '$lib/models/chart';
	import { ChartType } from '$lib/enums/chart';
	import type { Snippet } from 'svelte';

	let {
		data,
		configuration,
		header,
		emptyState,
	}: {
		data: BarChartData[] | undefined;
		configuration: ChartConfig;
		header?: Snippet;
		emptyState?: Snippet;
	} = $props();
</script>

<AppChart {data} {configuration} type={ChartType.Bar} {header} {emptyState}></AppChart>
