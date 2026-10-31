<script lang="ts">
	import { GET } from "$lib/api/helpers/request";
	import type { Plans } from "$lib/enums/plans";
	import { locale, t } from "$lib/i18n";
	import { onMount, type Component } from "svelte";
	import { PaymentsGetCheckoutLink } from "../../../../../../api";
	import { page } from "$app/state";
	import * as Alert from "$lib/components/ui/alert";
	import { Clock, DoorClosed, ExternalLink, type IconProps } from "@lucide/svelte";

	let plan: Plans = $derived(page.data.plan);
	let loadingLink = $state(false);
	let renewnalPageOpened = $state(false);
	let renewnalPageClosed = $state(false);
	onMount(() => {
	  loadingLink = true;
	  generateCheckoutLinkAndRedirect(plan);
	});

    async function generateCheckoutLinkAndRedirect(plan: Plans) {
		const queryParams = new URLSearchParams({
			language: locale.get(),
			renewLicense: 'true'
		});
		const checkouLinkRes = await GET<{ checkoutLink: string }>(
			`${PaymentsGetCheckoutLink(plan)}?${queryParams}`
		);

		if (!checkouLinkRes?.checkoutLink) {
			// error message
			return;
		}
  		const handle = window.open(
            checkouLinkRes?.checkoutLink,
            "_blank",
        );
		loadingLink = false;
		renewnalPageOpened = true;
        if (!handle || handle.closed) {
          // The window wasn't allowed to open
          // This is likely caused by built-in popup blockers.
          renewnalPageOpened = false;
          renewnalPageClosed = true;
          return;
        }
        const checkChildWindow = setInterval(() => {
          if (handle.closed) {
            clearInterval(checkChildWindow);
            renewnalPageOpened = false;
            renewnalPageClosed = true;
          }
        }, 1_000);
	}
</script>

{#if loadingLink}
    {@render alert({
      title: 'common.redirecting_to_renewal_page_checkout',
      icon: {
        component: ExternalLink,
      },
      class: 'text-secondary border-secondary/50 bg-secondary/20'
    })}
{/if}
{#if renewnalPageOpened}
    {@render alert({
      title: 'common.renewal_page_checkout_waiting_for_action',
      icon: {
        component: Clock
      },
      class: 'text-primary border-primary/50 bg-primary/20'
    })}
{/if}
{#if renewnalPageClosed}
    {@render alert({
      title: 'common.renewal_page_checkout_closed',
      icon: {
        component: DoorClosed
      },
      variant: 'destructive',
      class: 'border-destructive/50 bg-destructive/20'
    })}
{/if}


{#snippet alert(parameters: {
    title: string;
    icon: {component: Component; props?: IconProps}
    description?: string;
    variant?: Alert.AlertVariant;
    class?: string
})}
	<Alert.Root variant={parameters.variant ?? 'default'} class={'max-w-100 ' + parameters.class}>
	    <parameters.icon.component ...paramters.icon.props></parameters.icon.component>
	    <Alert.Title>{$t(parameters.title)}</Alert.Title>
		{#if parameters.description}
	        <Alert.Description>{$t(parameters.description)}</Alert.Description>
		{/if}
	</Alert.Root>
{/snippet}
