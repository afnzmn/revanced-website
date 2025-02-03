<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

	export let title: string;
	let expanded: boolean = false;
</script>

<div class="desktop-only">
	<span>{title}</span>
	<ul>
		<slot />
	</ul>
</div>

<div class="mobile-only">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<button class="title" on:click={() => (expanded = !expanded)}>
		<span>
			{title}
		</span>
		<div class="arrow" style:transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}>
			<ChevronDown size="24px" color="var(--surface-six)" />
		</div>
	</button>
	{#if expanded}
		<ul transition:slide={{ easing: quintOut, duration: 500 }}>
			<slot />
		</ul>
	{/if}
</div>

<style lang="scss">
	span {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 600;
	}

	ul {
		margin: 1.25rem 0rem;
		display: flex;
		gap: 1rem;
		flex-direction: column;
		width: max-content;
	}

	.title {
		display: flex;
		justify-content: space-between;
		background-color: transparent;
		border: none;
		width: 100%;
		margin: 1.5rem 0;
		cursor: pointer;
	}

	.mobile-only:not(:last-child) {
		border-bottom: 1px solid var(--border);
	}

	.mobile-only {
		display: none;
	}

	.arrow {
		transition: all 0.2s var(--bezier-one);
		user-select: none;
	}

	@media screen and (max-width: 768px) {
		.mobile-only {
			display: block;
		}
		.desktop-only {
			display: none;
		}
	}
</style>
