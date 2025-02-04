<script lang="ts">
	import Info from 'svelte-material-icons/InformationOutline.svelte';
	import Warning from 'svelte-material-icons/AlertOutline.svelte';
	import Caution from 'svelte-material-icons/AlertCircleOutline.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let level: 'info' | 'warning' | 'caution' = 'info';
	export let permanent: boolean = false;

	const icons = { info: Info, warning: Warning, caution: Caution };

	const dispatch = createEventDispatcher();
	let closed: boolean = false;

	const dismissBanner = () => {
		closed = true;
		dispatch('dismissed');
	};
</script>

<div class="banner-container" class:closed class:permanent>
	<div class="banner {level}">
		<div class="banner-text">
			<svelte:component this={icons[level]} size={permanent ? 22.4 : 32} />
			<span><slot /></span>
		</div>
		{#if !permanent}
			<Button type="text" icon="close" on:click={dismissBanner}>Dismiss</Button>
		{/if}
	</div>
</div>

<style>
	.banner-container,
	.banner-container *,
	.banner-container :global(*) {
		transition: none;
	}

	.banner-text :global(a) {
		color: inherit;
		text-decoration: none;
		font-weight: 700;
	}

	.banner-text :global(a:hover) {
		text-decoration: underline;
	}

	.banner-container {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.banner-container:not(.permanent) {
		animation: dropDown var(--bezier-one) 0.7s forwards;
	}

	.banner-container.closed {
		animation: swipeUp var(--bezier-one) 1.5s forwards;
	}

	.banner-container.permanent {
		font-size: 0.87rem;
	}

	.banner {
		margin: 0;
		padding: 1.5rem 1.7rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.3rem;
		margin: 0.7rem 1rem;
		border-radius: 1rem;
	}

	.banner-container.permanent > .banner {
		padding: 0.5rem 0.7rem;
		margin: 0;
		border-radius: 0;
		width: 100%;
	}

	.banner-text {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 0.55rem;
		word-wrap: break-word;
	}

	.banner.info {
		background-color: var(--surface-four);
		color: var(--text-one);
	}

	.banner.warning {
		background-color: var(--yellow-one);
		color: #000;
	}

	.banner.warning > :global(button) {
		color: #000;
	}

	.banner.warning > :global(button img) {
		filter: grayscale(1) brightness(0); /* Make the icon black */
	}

	.banner.caution {
		background-color: var(--red-two);
		color: #000;
	}

	.banner.caution > :global(button) {
		color: #000;
	}

	.banner.caution > :global(button img) {
		filter: grayscale(1) brightness(0); /* Make the icon white */
	}

	.banner > :global(button):hover {
		text-decoration: underline;
	}

	@media screen and (max-width: 767px) {
		.banner {
			flex-direction: column;
			padding: 1.1rem 1.3rem;
		}

		.banner > :global(button) {
			align-self: flex-end;
		}
	}

	@keyframes dropDown {
		0% {
			top: -100%;
		}
		100% {
			top: 0;
		}
	}

	@keyframes swipeUp {
		0% {
			top: 0;
		}
		100% {
			top: -100%;
		}
	}
</style>
