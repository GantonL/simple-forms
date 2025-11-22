import { renderComponent } from '$lib/components/ui/data-table';
import { locale } from '$lib/i18n';
import type { TableConfiguration } from '$lib/models/table';
import type { FormSubmission } from '$lib/server/database/schemas/form';
import { ExternalLink } from '@lucide/svelte';
import type { ColumnDef } from '@tanstack/table-core';

export const tableConfiguration: TableConfiguration<FormSubmission> = {
	serverSide: {
		enabled: true,
		manualPagination: true
	},
	hideAddDataAction: true
};

export const columns: ColumnDef<FormSubmission>[] = [
	{
		accessorKey: 'userFormName',
		header: 'common.form_name'
	},
	{
		accessorKey: 'createAt',
		header: 'common.created_at',
		cell: ({ row }) => {
			const createdAt = row.original.createdAt;
			if (!createdAt) return;
			return Intl.DateTimeFormat(locale.get()).format(new Date(createdAt));
		}
	},
	{
		accessorKey: 'storageUrl',
		id: 'storageUrl',
		header: '',
		cell: ({ row }) => {
			return renderComponent(ExternalLink, {
				size: 16,
				onclick: () => window.open(row.getValue('storageUrl'), '_blank')
			});
		}
	}
];
