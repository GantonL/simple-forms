import {
	defaultCostCell,
	defaultDateCell
} from '$lib/components/app-data-table/configurations/defaults';
import { renderComponent } from '$lib/components/ui/data-table';
import type { TableConfiguration } from '$lib/models/table';
import type { ColumnDef } from '@tanstack/table-core';
import DownloadInvoice from '$lib/components/download-invoice/download-invoice.svelte';
export const DEFAULT_ORDER_BY = '-createdAt';
export const invoicesTable: {
	columns: ColumnDef<unknown>[];
	configuration: TableConfiguration<unknown>;
} = {
	columns: [
		{
			accessorKey: 'created',
			header: 'common.created_at',
			cell: ({ row }) => {
				const created = row.original.created;
				return defaultDateCell(created);
			}
		},
		{
			accessorKey: 'gross',
			header: 'common.paid',
			cell: ({ row }) => {
				const gross = row.original.gross;
				return defaultCostCell(gross, row.original.currency);
			}
		},
		{
			accessorKey: 'id',
			id: 'downloadInvoice',
			header: '',
			cell: ({ row }) => {
				return renderComponent(DownloadInvoice, {
					id: row.original.id,
					created: row.original.created
				});
			}
		}
	],
	configuration: {
		hideAddDataAction: true,
		pageSize: 10,
		serverSide: {
			enabled: true,
			manualPagination: true
		}
	}
};
