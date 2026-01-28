<script lang="ts">
	import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';
	import type { UserFormData } from '$lib/models/user-form-data';
	import FieldRenderer from '$lib/components/user-form-builder/field-renderer.svelte';
	import { t } from '$lib/i18n';
	import { direction } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import CompiledMarkdown from '../resource-markdown/compiled-markdown.svelte';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';
	import * as Card from '../ui/card';
	import { NOTIFICATIONS } from '$lib/models/workflows';
	import type { SignedFormUserPreferedOptions } from '$lib/models/signed-form-user-prefered-options';

	type FieldRendererMode = 'default' | 'display';

	type FormPreviewProps = {
		schema: FormTemplateSchema;
		userData: UserFormData;
		onSubmit?: (data: UserFormData, options?: SignedFormUserPreferedOptions) => Promise<void>;
		mode?: 'demo';
		forceFieldRendererMode?: FieldRendererMode;
	};

	let {
		schema,
		userData: initialUserData,
		onSubmit,
		mode,
		forceFieldRendererMode
	}: FormPreviewProps = $props();

	let userData = $state(initialUserData);
	let isGeneratingPdf = $state(false);
	let isFormValid = $state(false);
	let fieldRendererMode = $derived<FieldRendererMode>(isGeneratingPdf ? 'display' : 'default');
	let sendCopyRequested = $state(false);
	let sendCopyEmail = $state('');

	type SectionItem = {
		type: 'text' | 'field';
		id: string;
		content?: string;
	};

	const parseSectionItem = (item: string): SectionItem | null => {
		// Check if it's a field reference (format: "fields:field_id")
		if (item.startsWith('fields:')) {
			const fieldId = item.substring(7); // Remove "fields:" prefix
			const field = schema.fields?.find((f) => f.id === fieldId);
			if (field) {
				return { type: 'field', id: fieldId };
			}
		} else {
			// It's a text block reference
			const textBlock = schema.editableTextBlocks?.find((block) => block.id === item);
			if (textBlock) {
				const content = userData.editableTextBlocks?.[item] || $t(textBlock.content);
				return { type: 'text', id: item, content };
			}
		}
		return null;
	};

	const getField = (fieldId: string) => {
		return schema.fields?.find((f) => f.id === fieldId);
	};

	const handleFormInvalidation = $derived(() => {
		if (!schema.fields || !userData.fields) return true;
		const allFieldsValid = schema.fields.every((field) => {
			if (!field.required) return true;

			const value = userData.fields?.[field.id];

			if (
				value === undefined ||
				value === null ||
				((typeof value === 'string' || Array.isArray(value)) && value.length === 0)
			) {
				return false;
			}

			if (field.type === 'signature' && typeof value === 'string') {
				return value.startsWith('data:image');
			}

			return true;
		});

		isFormValid = allFieldsValid;
	});

	async function handleSubmission() {
		isGeneratingPdf = true;
		await onSubmit?.(userData, buildSubmitOptions());
		isGeneratingPdf = false;
	}

	function buildSubmitOptions() {
		const options: SignedFormUserPreferedOptions = {};
		if (sendCopyEmail) {
			options.notifications = {
				...options.notifications,
				[NOTIFICATIONS.SIGNEE_REQUESTED_SIGNED_COPY]: {
					...options.notifications?.[NOTIFICATIONS.SIGNEE_REQUESTED_SIGNED_COPY],
					signee_form_copy_email: sendCopyEmail
				}
			};
		}
		return options;
	}

	function sendMeCopyCheckedChanged(checked: boolean) {
		sendCopyRequested = checked;
	}

	$effect(() => {
		if (userData.linkedFields && userData.fields) {
			for (const [targetId, sourceId] of Object.entries(userData.linkedFields)) {
				const sourceValue = userData.fields[sourceId];
				if (sourceValue !== undefined && userData.fields[targetId] !== sourceValue) {
					userData.fields[targetId] = sourceValue;
				}
			}
		}
	});
</script>

<div
	class="form mx-auto w-full max-w-4xl bg-white p-8 text-black print:p-0"
	style="direction: {$direction === 'lr' ? 'ltr' : 'rtl'}"
>
	<!-- Layout-based rendering -->
	{#if schema.layout?.sections && schema.layout.sections.length > 0}
		<div class="space-y-6">
			{#each schema.layout.sections as section, sectionIndex (sectionIndex)}
				<div class="flex flex-row flex-wrap items-start gap-2 space-y-4">
					{#each section as item, itemIndex (itemIndex)}
						{@const parsedItem = parseSectionItem(item)}
						{#if parsedItem}
							{#if parsedItem.type === 'text'}
								<!-- Render text content without label -->
								{#if parsedItem.content}
									<div data-pdf-markdown>
										<CompiledMarkdown content={parsedItem.content}></CompiledMarkdown>
									</div>
								{/if}
							{:else if parsedItem.type === 'field'}
								<!-- Render actual input field -->
								{@const field = getField(parsedItem.id)}
								{#if field && userData.fields}
									<div
										class="inline-block min-w-[200px] md:min-w-[250px] print:break-inside-avoid"
										data-pdf-item
									>
										<FieldRenderer
											field={userData.linkedFields && field.id in userData.linkedFields
												? { ...field, disabled: true }
												: field}
											bind:value={userData.fields[field.id]}
											onChange={handleFormInvalidation}
											mode={forceFieldRendererMode ?? fieldRendererMode}
										/>
									</div>
								{/if}
							{/if}
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Submit Button -->
{#if mode !== 'demo'}
	<div class="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-2 py-8">
		{@render moreOptions()}
		<Button
			onclick={handleSubmission}
			disabled={isGeneratingPdf || !isFormValid}
			size="lg"
			class="w-full"
		>
			{#if isGeneratingPdf}
				{$t('common.generating')}...
			{:else}
				{$t('common.submit')}
			{/if}
		</Button>
	</div>
{/if}

{#snippet moreOptions()}
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>{$t('common.more_options')}</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex w-full flex-col gap-2">
				<div class="flex w-fit cursor-pointer flex-row items-center gap-2">
					<Checkbox
						class="border-secondary cursor-pointer"
						id="sendCopy"
						onCheckedChange={sendMeCopyCheckedChanged}
					/>
					<Label for="sendCopy" class="cursor-pointer text-nowrap"
						>{$t('common.send_me_a_copy')}</Label
					>
				</div>
				<Input
					type="email"
					bind:value={sendCopyEmail}
					disabled={!sendCopyRequested}
					required
					tabindex={0}
					autofocus={true}
					placeholder={$t('common.email')}
					class="border-secondary"
				/>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

<style>
	@media print {
		* {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}
		p {
			page-break-inside: avoid;
		}
	}
</style>
