export interface BasePageProps {
	title: string;
	description: string;
	dataLoader?: ScrollLoader | ClickLoader;
	onLoadMore?: () => void;
	dataLoading?: boolean;
	endOfData?: boolean;
}

export interface ScrollLoader {
	event: 'scroll';
	threshold: number;
}

export interface ClickLoader {
	event: 'click';
}
