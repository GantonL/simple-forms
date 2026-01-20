export enum LoadStatus {
	MINIMUM = 'minimum',
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
	EXTREME = 'extreme'
}

export interface RemoteBrwoserServiceLoadStatusResponse {
	percentage: `${number}%`;
	status: LoadStatus;
	message: string;
	queue: number;
}
