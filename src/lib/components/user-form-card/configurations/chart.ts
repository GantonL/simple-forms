import type { ChartConfig } from '$lib/components/ui/chart';
import type { BarChartData } from '$lib/models/chart';
import type { BarChartProps } from 'layerchart';

export const chartConfiguration: ChartConfig = {
	y: { label: 'common.submissions', color: 'var(--chart-1)' }
};

export const chartProps: BarChartProps<BarChartData[]>['props'] = {
	yAxis: {
		format: (value) => Number(value).toFixed(0),
		ticks: (scale) => {
			const [min, max] = scale.domain();
			const ticksArray = [];
			for (let i = Math.ceil(min); i <= Math.floor(max); i++) {
				ticksArray.push(i);
			}
			return ticksArray;
		}
	}
};
