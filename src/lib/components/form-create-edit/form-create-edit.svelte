<script lang="ts">
	import BasePage from '$lib/components/base-page/base-page.svelte';
	import UserFormBuilder from '$lib/components/user-form-builder/user-form-builder.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { type UserForm, type FormTemplate } from '$lib/server/database/schemas/form';
	import { toast } from 'svelte-sonner';
	import { t } from '$lib/i18n';
	import { LoaderCircle } from '@lucide/svelte';
	import { POST, PUT } from '$lib/api/helpers/request';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input/input.svelte';
	import FormPreviewDialog from '$lib/components/form-preview/form-preview-dialog.svelte';
	import { UsersForms } from '../../../routes/api';
	import type { UserFormData } from '$lib/models/user-form-data';
	import DangerZone from '../danger-zone/danger-zone.svelte';

	type mode = 'create' | 'edit';

	let { template, userForm }: { template: FormTemplate; userForm?: UserForm } = $props();

	let internalUserData = $state<UserFormData>({
		editableTextBlocks: {},
		fields: {}
	});
	let formName: string = $state('');
	let formDescription: string = $state('');

	let componentMode = $state<mode>('create');

	$effect.pre(() => {
		if (userForm) {
			internalUserData = userForm.data ?? internalUserData;
			formName = userForm.name;
			formDescription = userForm.description ?? formDescription;
			componentMode = 'edit';
		}
	});

	let isSubmitting = $state(false);
	let showPreview = $state(false);

	async function handleCreate() {
		isSubmitting = true;
		try {
			const created = await POST<
				Pick<UserForm, 'template_id' | 'data' | 'name' | 'description'>[],
				UserForm[]
			>(UsersForms, [
				{
					template_id: template.id,
					data: internalUserData,
					name: formName,
					description: formDescription
				}
			]);
			if (created[0]?.id) {
				toast.success(t.get('common.form_creation_success'));
				goto(resolve('/forms'));
				return;
			} else {
				toast.error(t.get('common.form_creation_failed'));
			}
		} finally {
			isSubmitting = false;
		}
	}

	async function handleEdit() {
		isSubmitting = true;
		try {
			const { updated } = await PUT<
				Pick<UserForm, 'data' | 'description' | 'name'>,
				unknown,
				{ updated: UserForm }
			>(
				`${UsersForms}/${userForm!.id}`,
				{
					data: internalUserData,
					name: formName,
					description: formDescription
				},
				{}
			);
			if (updated?.id) {
				toast.success(t.get('common.form_update_success'));
				goto(resolve('/forms'));
				return;
			} else {
				toast.error(t.get('common.form_update_failed'));
			}
		} finally {
			isSubmitting = false;
		}
	}

	function handlePreview() {
		showPreview = true;
	}

	function handleReset() {
		formName = '';
		formDescription = '';
		internalUserData = {
			editableTextBlocks: {},
			fields: {}
		};
	}

	function handleCancel() {
		history.back();
	}
</script>

<BasePage title="common.{componentMode}" description="seo.pages.form_{componentMode}.description">
	<Card class="w-full">
		<CardHeader>
			<CardTitle
				>{$t(`common.form_builder.${componentMode === 'edit' ? 'edit_' : ''}title`)}</CardTitle
			>
			<CardDescription>{$t('common.form_builder.description')}</CardDescription>

			<div class="space-y-2">
				<Label for="name">{$t('common.form_name')}</Label>
				<Input
					id="name"
					type="text"
					bind:value={formName}
					required
					placeholder={$t('common.form_name_placeholder')}
				/>
			</div>
			<div class="space-y-2">
				<Label for="description">{$t('common.form_description')}</Label>
				<textarea
					id="description"
					bind:value={formDescription}
					placeholder={$t('common.form_description_placeholder')}
					class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				></textarea>
			</div>
		</CardHeader>
		<CardContent>
			<UserFormBuilder schema={template.schema} bind:userData={internalUserData} />
		</CardContent>
		<CardFooter class="flex flex-col gap-4">
			<div class="flex w-full justify-between gap-2">
				<div class="flex gap-2">
					<Button variant="secondary" onclick={handlePreview} disabled={isSubmitting}>
						{$t('common.form_builder.preview')}
					</Button>
					<Button
						class="flex flex-row items-center gap-2"
						onclick={componentMode === 'create' ? handleCreate : handleEdit}
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							<LoaderCircle size={12} />
						{/if}
						<span>
							{$t(
								`common.form_builder.${componentMode === 'create' ? 'create_form' : 'edit_form'}`
							)}
						</span>
					</Button>
				</div>
				<Button variant="ghost" onclick={handleCancel} disabled={isSubmitting}>
					{$t('common.cancel')}
				</Button>
			</div>
			<DangerZone class="w-full">
				<Button variant="outline" onclick={handleReset} disabled={isSubmitting}>
					{$t('common.form_builder.reset')}
				</Button>
			</DangerZone>
		</CardFooter>
	</Card>
</BasePage>

<FormPreviewDialog bind:show={showPreview} schema={template.schema} data={internalUserData} />
