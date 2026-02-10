import { defaultDateCell } from '$lib/components/app-data-table/configurations/defaults';
import { renderComponent } from '$lib/components/ui/data-table';
import type { TableConfiguration } from '$lib/models/table';
import type { FormSubmissionCandidateDataSelect } from '$lib/server/database/schemas/form';
import type { ColumnDef } from '@tanstack/table-core';
import RegeneratePreprocessedSubmission from './regenerate-preprocessed-submission.svelte';
import { getSigneeKey } from '$lib/utils';

export const DEFAULT_ORDER_BY = '-createdAt';

export const tableConfiguration: TableConfiguration<FormSubmissionCandidateDataSelect> = {
	hideAddDataAction: true,
	pageSize: 10
};

export const columns: ColumnDef<FormSubmissionCandidateDataSelect>[] = [
	{
		accessorKey: 'createAt',
		header: 'common.created_at',
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return defaultDateCell(createdAt);
		}
	},
	{
		accessorKey: 'data',
		header: 'common.signee',
		cell: ({ row }) => {
			const data = row.original.data;
			const fields = data!.fields!;
			const keys = Object.keys(fields);
			const signeeKey = getSigneeKey(keys, data!.signeeFieldKey);
			return fields[signeeKey ?? keys[0]];
		}
	},
	{
		accessorKey: 'id',
		id: 'regenerate',
		header: '',
		cell: ({ row }) => {
			return renderComponent(RegeneratePreprocessedSubmission, {
				preProcessedSubmission: row.original
			});
		}
	}
];
