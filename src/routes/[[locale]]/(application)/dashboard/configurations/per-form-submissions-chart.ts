import type { ChartConfig } from '$lib/components/ui/chart';
import type { BarChartData } from '$lib/models/chart';
import type { BarChartProps } from 'layerchart';
export const chartConfiguration: ChartConfig = {
	form1: { label: '', color: 'var(--chart-1)' },
	form2: { label: '', color: 'var(--chart-2)' },
	form3: { label: '', color: 'var(--chart-3)' }
};

export const chartProps: BarChartProps<BarChartData[]>['props'] = {
	legend: {},
	yAxis: {
		format: (value) => Number(value).toFixed(0)
	}
};
