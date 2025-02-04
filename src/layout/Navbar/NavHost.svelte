<script lang="ts">
	import { onMount } from 'svelte';
	import { horizontalSlide } from '$util/horizontalSlide';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { createQuery } from '@tanstack/svelte-query';

	import Navigation from './NavButton.svelte';
	import Modal from '$lib/components/Dialogue.svelte';
	import Button from '$lib/components/Button.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import Query from '$lib/components/Query.svelte';

	import Cog from 'svelte-material-icons/Cog.svelte';
	import Replay from 'svelte-material-icons/Replay.svelte';

	import { status_url, api_base_url, set_api_base_url, default_api_url } from '$data/api/settings';
	import RouterEvents from '$data/RouterEvents';
	import { queries } from '$data/api';

	import { useQueryClient } from '@tanstack/svelte-query';

	const client = useQueryClient();

	function reload() {
		location.reload();
	}

	function clear_and_reload() {
		client.clear();
		// `client.clear()` does technically do this for us, but it takes a while.
		localStorage.clear();

		reload();
	}

	let url = api_base_url();
	const statusUrl = status_url();

	function save() {
		set_api_base_url(url);
		reload();
	}

	function reset() {
		url = default_api_url;
	}

	let menuOpen = false;
	let modalOpen = false;
	let y: number;
	const pingQuery = () => createQuery(['ping'], queries.ping);

	onMount(() => {
		return RouterEvents.subscribe((event) => {
			if (event.navigating) {
				menuOpen = false;
			}
		});
	});
</script>

<svelte:window bind:scrollY={y} />

<div id="nav-container">
	<Query query={pingQuery()} let:data>
		{#if !data}
			<span class="banner">
				<Banner level="caution" permanent>
					The API is currently unresponsive and some services may not work correctly. {#if statusUrl}
						Check the <a href={statusUrl} target="_blank" rel="noopener noreferrer">status page</a> for
						updates.
					{/if}
				</Banner>
			</span>
		{/if}
	</Query>

	<nav class:scrolled={y > 10}>
		<a class="menu-btn skiptab-btn" href="#skiptab">Skip navigation</a>

		<button
			class="menu-btn mobile-only"
			on:click={() => (menuOpen = !menuOpen)}
			class:open={menuOpen}
			aria-label="Menu"
		>
			<span class="menu-btn__burger" />
		</button>
		<a href="/" id="logo"><img src="/logo.svg" alt="ReVanced Logo" /></a>

		{#key menuOpen}
			<div
				id="nav-wrapper-container"
				class:desktop-only={!menuOpen}
				transition:horizontalSlide={{ direction: 'inline', easing: expoOut, duration: 400 }}
			>
				<div id="banner-pad">
					<Query query={pingQuery()} let:data>
						{#if !data}
							<span class="banner">
								<Banner level="caution" permanent>
									The API is currently unresponsive and some services may not work correctly. {#if statusUrl}
										Check the
										<a href={statusUrl} target="_blank" rel="noopener noreferrer">status page</a> for
										updates.
									{/if}
								</Banner>
							</span>
						{/if}
					</Query>
				</div>

				<div class="nav-wrapper">
					<div id="main-navigation">
						<ul class="nav-buttons">
							<Navigation href="/" label="Home">Home</Navigation>
							<Navigation queryKey="manager" href="/download" label="Download">Download</Navigation>
							<Navigation queryKey="patches" href="/patches" label="Patches">Patches</Navigation>
							<Navigation queryKey="contributors" href="/contributors" label="Contributors">
								Contributors
							</Navigation>
							<Navigation queryKey={['about', 'team']} href="/donate" label="Donate"
								>Donate</Navigation
							>
						</ul>
					</div>
					<div id="secondary-navigation">
						<button on:click={() => (modalOpen = !modalOpen)} aria-label="Settings">
							<Cog size="20px" color="var(--surface-six)" />
						</button>
					</div>
				</div>
			</div>
		{/key}

		{#if menuOpen}
			<div
				class="overlay mobile-only"
				transition:fade={{ duration: 350 }}
				on:click={() => (menuOpen = !menuOpen)}
				on:keypress={() => (menuOpen = !menuOpen)}
			/>
		{/if}
	</nav>
</div>

<!-- settings -->
<Modal bind:modalOpen>
	<svelte:fragment slot="icon">
		<Cog size="24px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">Settings</svelte:fragment>
	<svelte:fragment slot="description">Configure the API for this website.</svelte:fragment>
	<div id="settings-content">
		<div class="input-wrapper">
			<input name="api-url" type="text" bind:value={url} />
			<button id="button-reset" on:click={reset} aria-label="Reset Button">
				<Replay size="24px" color="var(--surface-six)" />
			</button>
		</div>
	</div>

	<svelte:fragment slot="buttons">
		<Button type="text" on:click={clear_and_reload} label="Reset Button">Reset</Button>
		<Button type="text" on:click={save} label="Save Button">Save</Button>
	</svelte:fragment>
</Modal>

<style lang="scss">
	#logo {
		padding: 0.5rem;
	}

	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input-wrapper {
		margin-bottom: 0.75rem;
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	input {
		width: 100%;
		position: relative;
		padding-right: 3rem;
		margin-top: 1rem;
	}

	#button-reset {
		position: absolute;
		right: 12px;
		top: 30px;
	}

	#nav-container {
		position: sticky;
		z-index: 666;
		width: 100%;

		&:has(.nav-buttons > li:first-child.selected) {
			margin-bottom: 2.65rem;

			&:has(.banner) {
				margin-bottom: 1.5rem;
			}
		}
	}

	nav {
		display: flex;
		gap: 2rem;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		height: 70px;
		background-color: var(--surface-eight);
		width: 100%;
	}

	#main-navigation,
	#secondary-navigation {
		align-items: center;
		display: flex;
		gap: 2rem;
	}

	img {
		height: 22px;
	}

	.nav-buttons {
		display: flex;
		gap: 1rem;
	}

	.scrolled {
		box-shadow: var(--drop-shadow-one);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 88;
	}

	.nav-wrapper {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		.nav-wrapper {
			align-items: center;
		}
	}

	#banner-pad {
		display: none;
	}

	#nav-wrapper-container {
		width: 100%;
	}

	@media (max-width: 767px) {
		#banner-pad {
			display: block;
			width: 100vw;
			visibility: hidden;
		}

		#nav-container:has(.nav-buttons > li:first-child.selected):has(.banner) {
			margin-bottom: 0rem;
		}

		#nav-wrapper-container {
			overflow: hidden;
			position: fixed;
			width: 20rem;
			top: 0;
			left: 0;
			height: 100%;
			background-color: var(--surface-eight);
			z-index: 100;
		}

		.nav-wrapper {
			flex-direction: column;
			gap: 0.5rem;
			height: 100%;
			margin: 0 auto;
			width: 20rem;
			border-radius: 0px 24px 24px 0px;
			padding: 1rem;
			padding-top: 6rem;
		}

		.desktop-only {
			display: none !important;
		}

		nav {
			justify-content: normal;
		}

		.nav-buttons {
			flex-direction: column;
			gap: 0.5rem;
			width: 100%;
		}

		#secondary-navigation {
			z-index: 100;
			padding: 16px;
		}
	}

	@media screen and (min-width: 768px) {
		.mobile-only {
			display: none !important;
		}
	}

	/* Hamburger mmm yum */
	.menu-btn {
		user-select: none;
		position: relative;
		display: flex;
		height: 50px;
		z-index: 999;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.menu-btn__burger {
		display: flex;
		flex-wrap: wrap;
	}

	.menu-btn__burger,
	.menu-btn__burger::before,
	.menu-btn__burger::after {
		width: 24px;
		height: 2px;
		background: var(--surface-six);
		transition: all 0.3s var(--bezier-one);
	}

	.menu-btn__burger::before,
	.menu-btn__burger::after {
		content: '';
		position: absolute;
	}
	.menu-btn__burger::before {
		transform: translateY(-6.5px);
	}
	.menu-btn__burger::after {
		transform: translateY(6.5px);
	}
	/* ANIMATION */
	.menu-btn.open .menu-btn__burger {
		transform: translateX(-10px);
		background: transparent;
		box-shadow: none;
	}
	.menu-btn.open .menu-btn__burger::before {
		transform: rotate(45deg) translate(10px, -10px);
	}
	.menu-btn.open .menu-btn__burger::after {
		transform: rotate(-45deg) translate(10px, 10px);
	}

	.skiptab-btn {
		position: fixed;
		left: -300px;
		border-radius: 100px;
		text-decoration: none;
		background-color: var(--primary);
		z-index: 10;
		color: var(--text-three);
		font-weight: 600;
		font-size: 0.95rem;
		padding: 16px 24px;
	}

	.skiptab-btn:focus {
		left: 12px;
	}
</style>
