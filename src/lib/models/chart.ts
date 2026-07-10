export type BarChartData =
	| {
			[k in string]: number;
	  }
	| {
			x: string;
			y: number;
	  };
