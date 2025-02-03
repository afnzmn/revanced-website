<script lang="ts">
	export let type: 'filled' | 'tonal' | 'text' | 'outlined';
	export let icon: any | undefined = undefined;
	export let iconSize = 20;
	export let iconColor = 'currentColor';
	export let href: string = '';
	export let target: string = '';
	export let label: string = '';
</script>

{#if href}
	<a {href} {target} class={`button-${type}`} aria-label={label}>
		<svelte:component this={icon} size={iconSize} color={iconColor} />
		<slot />
	</a>
{:else}
	<button on:click class={`button-${type}`} aria-label={label}>
		<svelte:component this={icon} size={iconSize} color={iconColor} />
		<slot />
	</button>
{/if}

<style>
	button {
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
	}

	a,
	button {
		min-width: max-content;
		font-size: 0.95rem;
		text-decoration: none;
		color: var(--text-one);
		font-weight: 600;
		border: none;
		border-radius: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		transition:
			transform 0.4s var(--bezier-one),
			filter 0.4s var(--bezier-one);
		user-select: none;
	}

	.button-filled {
		background-color: var(--primary);
		color: var(--text-three);
	}
	.button-tonal {
		background-color: var(--surface-four);
	}

	.button-filled,
	.button-tonal {
		padding: 16px 24px;
	}

	.button-text {
		background-color: transparent;
		color: var(--primary);
		font-weight: 500;
		letter-spacing: 0.01rem;
	}

	button:hover,
	a:hover {
		filter: brightness(85%);
	}
</style>
