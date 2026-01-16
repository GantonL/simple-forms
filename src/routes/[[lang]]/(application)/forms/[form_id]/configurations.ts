import { renderComponent } from '$lib/components/ui/data-table';
import type { TableConfiguration } from '$lib/models/table';
import type { FormSubmission } from '$lib/server/database/schemas/form';
import type { ColumnDef } from '@tanstack/table-core';
import CreateFormSubmissionLink from './create-form-submission-link.svelte';
import { defaultDateCell } from '$lib/components/app-data-table/configurations/defaults';
import { t } from '$lib/i18n';

export const DEFAULT_ORDER_BY = '-createdAt';

export const tableConfiguration: TableConfiguration<FormSubmission> = {
	serverSide: {
		enabled: true,
		manualPagination: true
	},
	hideAddDataAction: true,
	pageSize: 10
};

export const columns: ColumnDef<FormSubmission>[] = [
	{
		accessorKey: 'display_data',
		header: 'common.signee',
		cell: ({ row }) => {
			const signee = row.original?.display_data?.signee ?? t.get('common.unknown');
			return signee;
		}
	},
	{
		accessorKey: 'createAt',
		header: 'common.created_at',
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			return defaultDateCell(createdAt);
		}
	},
	{
		accessorKey: 'storageUrl',
		id: 'storageUrl',
		header: '',
		cell: ({ row }) => {
			return renderComponent(CreateFormSubmissionLink, { submission: row.original });
		}
	}
];
