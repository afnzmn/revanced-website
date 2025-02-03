<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { queries } from '$data/api';
	import { createQuery } from '@tanstack/svelte-query';

	import Query from '$lib/components/Query.svelte';
	import FooterSection from './FooterSection.svelte';

	import { RV_DMCA_GUID } from '$env/static/public';
	import { onMount } from 'svelte';

	export let showDivider = true;

	const aboutQuery = createQuery(['about'], queries.about);

	let location: string;

	onMount(() => {
		// DMCA Protection Badge
		location = document.location.href;
	});
</script>

<!-- squiggly divider line -->
{#if showDivider}
	<svg
		aria-hidden="true"
		width="100%"
		height="8"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		in:fly={{ y: 10, easing: quintOut, duration: 750 }}
	>
		<pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
			<path
				d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0"
				stroke-linecap="square"
			/>
		</pattern>
		<rect width="100%" height="100%" fill="url(#a)" />
	</svg>
{/if}
<footer in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<div class="footer-top">
		<section class="main-content">
			<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
			<Query query={aboutQuery} let:data>
				{#if data}
					<div>
						<p>
							{data.about.about}
						</p>
					</div>
				{/if}
			</Query>
		</section>

		<section class="links-container">
			<FooterSection title="Pages">
				<li><a href="/">Home</a></li>
				<li><a href="/download">Download</a></li>
				<li><a href="/patches">Patches</a></li>
				<li><a href="/contributors">Contributors</a></li>
				<li><a href="/donate">Donate</a></li>
			</FooterSection>
			<Query query={aboutQuery} let:data>
				{#if data}
					<FooterSection title="Socials">
						{#each data.about.socials as { name, url }}
							<li>
								<a href={url} target="_blank" rel="noreferrer">{name}</a>
							</li>
						{/each}
					</FooterSection>
				{/if}
			</Query>
		</section>
	</div>
	<div class="footer-bottom">
		<div id="logo-name"><span>Re</span>Vanced</div>
		<a href="/donate"><div>Donate</div></a>
		<Query query={aboutQuery} let:data>
			{#if data}
				<a href="mailto:{data.about.contact.email}"><div>Email</div></a>
			{/if}
		</Query>
		<!-- DMCA Protection Badge -->
		<a
			href="//www.dmca.com/Protection/Status.aspx?ID={RV_DMCA_GUID}&refurl={location}"
			title="DMCA.com Protection Status"
			class="dmca-badge"
		>
			<img
				src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-08.png?ID={RV_DMCA_GUID}"
				alt="DMCA.com Protection Status"
			/></a
		>
	</div>
</footer>

<style>
	footer {
		margin: 4rem 0 5rem 0;
		margin-inline: auto;
		padding-bottom: 1rem;
		width: min(87%, 80rem);
	}

	.footer-top {
		display: flex;
		gap: 8rem;
		justify-content: space-between;
		margin-bottom: 4rem;
	}

	.footer-bottom {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.dmca-badge {
		display: flex;
		align-items: center;
	}

	@media screen and (max-width: 768px) {
		.footer-bottom {
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	#logo-name {
		font-size: 1.4rem;
		color: var(--text-one);
		font-weight: 600;
	}

	#logo-name span {
		color: var(--primary);
	}

	.footer-bottom a {
		text-decoration: none;
		color: var(--text-four);
		font-weight: 600;
	}

	li {
		list-style: none;
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
	}

	li a {
		color: var(--primary);
		font-weight: 600;
		font-size: 0.95rem;
	}

	path {
		stroke: var(--border);
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.logo-image {
		height: 2.5rem;
	}

	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline var(--secondary);
		color: var(--text-one);
	}

	.links-container {
		display: flex;
		gap: 10rem;
		margin-top: 1rem;
	}

	@media screen and (max-width: 1050px) {
		.footer-top {
			flex-direction: column;
			gap: 2rem;
		}

		.links-container {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		}
	}

	@media screen and (max-width: 768px) {
		.links-container {
			display: flex;
			flex-direction: column;
			gap: initial;
		}
	}

	svg {
		padding-left: 15px;
		padding-right: 15px;
	}
</style>
