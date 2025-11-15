import type { TableConfiguration } from '$lib/models/table';
import type { FormSubmission } from '$lib/server/database/schemas/form';
import type { ColumnDef } from '@tanstack/table-core';

export const tableConfiguration: TableConfiguration<FormSubmission> = {
	serverSide: {
		enabled: true
	},
	hideAddDataAction: true
};

export const columns: ColumnDef<FormSubmission>[] = [
	{
		accessorKey: 'userFormName',
		header: 'common.form_name',
		cell: (info) => info.getValue()
	},
	{
		accessorKey: 'createAt',
		header: 'common.created_at',
		cell: (info) => new Date(info.getValue() as Date).toLocaleDateString()
	},
	{
		accessorKey: 'storage_url',
		header: '',
		cell: (info) => {}
	}
];
