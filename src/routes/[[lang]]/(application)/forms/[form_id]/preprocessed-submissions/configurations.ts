import { defaultDateCell } from '$lib/components/app-data-table/configurations/defaults';
import type { TableConfiguration } from '$lib/models/table';
import type { FormSubmissionCandidateDataSelect } from '$lib/server/database/schemas/form';
import type { ColumnDef } from '@tanstack/table-core';

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
			const fields = row.original.data!.fields!;
			const keys = Object.keys(fields);
			const signeeKey = keys.find((k) => k.includes('full_name') || k.includes('email'));
			return fields[signeeKey ?? keys[0]];
		}
	}
];
