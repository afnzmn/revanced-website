<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Head from '$lib/components/Head.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Button from '$lib/components/Button.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import Query from '$lib/components/Query.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';

	import QRCode from './QRCode.svelte';
	import DonateHeartAnimation from './DonateHeartAnimation.svelte';
	import TeamMember from './TeamMember.svelte';

	import CircleMultipleOutline from 'svelte-material-icons/CircleMultipleOutline.svelte';
	import WalletOutline from 'svelte-material-icons/WalletOutline.svelte';
	import ChevronUp from 'svelte-material-icons/ChevronUp.svelte';

	import { supportsWebP } from '$util/supportsWebP';

	const teamQuery = createQuery(['team'], queries.team);
	const aboutQuery = createQuery(['about'], queries.about);

	let qrCodeDialogue = false;
	let cryptoDialogue = false;
	let addressSnackbar = false;
	let qrCodeValue = '';
	let qrCodeDialogueName = '';

	async function copyToClipboard(walletAddress: string) {
		addressSnackbar = true;
		qrCodeDialogue = false;

		try {
			await navigator.clipboard.writeText(walletAddress);
		} catch (error) {
			console.error('Failed to copy crypto wallet:', error);
		}
	}

	const shuffle = <T,>(array: T[]) =>
		array
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
</script>

<Head
	title="Donate to ReVanced"
	description="Donate to ReVanced with a variety of donation methods, including cryptocurrencies in order to allow us to maintain our servers and develop new features."
	schemas={[
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Download',
					item: 'https://revanced.app/donate'
				}
			]
		}
	]}
/>

<main class="wrapper" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<section>
		<div>
			<h2>🎉 Support <span style="color: var(--primary);">ReVanced</span></h2>
			<p>
				ReVanced offers a variety of patches, including ad-blocking, custom themes, and innovative
				features. All of which is completely open source and free of charge. Donating will allow
				ReVanced maintain our servers and develop new features.
			</p>
		</div>
		<div id="heart">
			<DonateHeartAnimation
				backgroundImageUrl="/revanced-logo-background.svg"
				foregroundImageUrl="/icons/heart.svg"
				alt="ReVanced Logo"
			/>
		</div>
	</section>
	<h3>Donate</h3>
	<Query query={aboutQuery} let:data>
		<div class="donate-cards">
			{#if data.about.donations.links}
				{#each data.about.donations.links as link}
					<a class="donate-card" target="_blank" rel="noreferrer" href={link.url}>
						<!-- not using <img/> because we want the image height to always be 200px -->
						<div
							style="background-image: url('/donate/card-images/{link.name}.{supportsWebP()
								? 'webp'
								: 'png'}'), url('/donate/card-images/fallback.svg');"
							role="img"
							aria-label="{link.name} preview image"
						/>
						<span>{link.name}</span>
					</a>
				{/each}
			{/if}
			{#if data.about.donations.wallets}
				<button class="donate-card" on:click={() => (cryptoDialogue = !cryptoDialogue)}>
					<div
						style="background-image: url('/donate/card-images/Cryptocurrencies.{supportsWebP()
							? 'webp'
							: 'png'}'), url('/donate/card-images/fallback.svg');"
						role="img"
						aria-label="Cryptocurrencies preview image"
					/>
					<span>Cryptocurrencies</span>
				</button>
			{/if}
		</div>
	</Query>
	<Query query={teamQuery} let:data>
		<h3>Meet the team</h3>
		{#if data.members.length > 0}
			<section class="team">
				<!-- randomize team members because equality -->
				{#each shuffle(data.members) as member, i}
					<TeamMember {member} {i} />
				{/each}
			</section>
		{/if}
	</Query>
</main>

<Dialogue bind:modalOpen={cryptoDialogue}>
	<svelte:fragment slot="icon">
		<CircleMultipleOutline size="32px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">Cryptocurrencies</svelte:fragment>
	<svelte:fragment slot="description">
		<hr style="margin: 1rem 0;" />
		<div class="wallets">
			<Query query={aboutQuery} let:data>
				{#each data.about.donations.wallets as wallet}
					<button
						on:click={() => {
							qrCodeValue = wallet.address;
							qrCodeDialogueName = wallet.currency_code;
							qrCodeDialogue = !qrCodeDialogue;
							// when the user clicks a wallet the crypto wallet goes away
							// because multi page dialogues aren't implemented yet oops
							cryptoDialogue = false;
						}}
					>
						<div class="wallet-name">
							<img
								src="/donate/crypto/{wallet.currency_code}.svg"
								onerror="this.onerror=null; this.src='/donate/fallback.svg'"
								alt={`${wallet.network} icon.'`}
							/>
							{`${wallet.network} (${wallet.currency_code})`}
						</div>
						<div id="arrow">
							<ChevronUp size="20px" color="var(--surface-six)" />
						</div>
					</button>
				{/each}
			</Query>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button type="filled" on:click={() => (cryptoDialogue = false)}>Close</Button>
	</svelte:fragment>
</Dialogue>

<Dialogue bind:modalOpen={qrCodeDialogue}>
	<svelte:fragment slot="icon">
		<WalletOutline size="32px" color="var(--surface-six)" />
	</svelte:fragment>
	<svelte:fragment slot="title">{qrCodeDialogueName} Wallet</svelte:fragment>
	<svelte:fragment slot="description">
		<div class="qr-code-body">
			{qrCodeValue}
			<QRCode codeValue={qrCodeValue} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Button
			type="text"
			on:click={() => {
				qrCodeDialogue = false;
				cryptoDialogue = true;
			}}>Back</Button
		>
		<Button type="filled" on:click={() => copyToClipboard(qrCodeValue)}>Copy Address</Button>
	</svelte:fragment>
</Dialogue>

<Snackbar bind:open={addressSnackbar}>
	<svelte:fragment slot="text">Address copied to clipboard</svelte:fragment>
</Snackbar>

<Footer />

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;

		// support revanced and heart thingy
		section {
			display: flex;
			justify-content: center;
			align-items: center;

			@media screen and (max-width: 768px) {
				flex-direction: column-reverse;
			}
		}
	}

	h2 {
		margin-bottom: 0.5rem;
		color: var(--text-one);
	}

	h3 {
		margin-bottom: 1.5rem;
	}

	p {
		margin-bottom: 2rem;
		width: 60%;

		@media screen and (max-width: 1200px) {
			width: 90%;
		}

		@media screen and (max-width: 768px) {
			width: 100%;
		}
	}

	// COPEEEE
	@media screen and (max-width: 768px) {
		#heart {
			display: none;
		}
	}

	.donate-cards {
		display: flex;
		gap: 1rem;
		margin-bottom: 3rem;

		@media screen and (max-width: 768px) {
			flex-direction: column;
		}
	}

	.donate-card {
		text-decoration: none;
		background-color: var(--surface-nine);
		border-radius: 1.5rem;
		width: 100%;
		cursor: pointer;
		text-align: left;
		border: none;
		overflow: hidden;
		transition:
			0.3s border-radius var(--bezier-one),
			0.3s background-color var(--bezier-one);

		&:hover {
			background-color: var(--tertiary);
		}

		&:active {
			border-radius: 2.75rem;
		}

		span {
			display: block;
			color: var(--text-four);
			font-size: 1.05rem;
			font-weight: 500;
			padding: 1.5rem;
		}

		div {
			height: 200px;
			background-size: cover;
			background-position: center;
			max-width: 100%;
		}
	}

	.wallets {
		// i just guessed this
		width: clamp(200px, 75vw, 375px);
		#arrow {
			height: 20px;
			transform: rotate(90deg);
		}

		button {
			width: 100%;
			font-size: 0.9rem;
			background-color: transparent;
			border: none;
			color: var(--text-four);
			cursor: pointer;
			text-align: left;
			display: flex;
			justify-content: space-between;
			background-color: var(--surface-seven);
			padding: 0.75rem 1.25rem;
			transition: filter 0.4s var(--bezier-one);

			&:hover {
				filter: brightness(85%);
			}
		}
	}

	.wallet-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		// crypto icon
		img {
			height: 24px;
			width: 24px;
		}
	}

	.qr-code-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		word-break: break-word;
		text-align: center;
	}

	.team {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
		justify-content: space-between;
		align-items: stretch;
		gap: 1rem;
		margin-bottom: 4rem;
	}
</style>
