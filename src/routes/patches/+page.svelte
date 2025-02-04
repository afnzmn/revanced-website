<script lang="ts">
	import { building } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { derived, readable, type Readable } from 'svelte/store';
	import { page } from '$app/stores';

	import type { Patch } from '$lib/types';

	import { createQuery } from '@tanstack/svelte-query';
	import { queries } from '$data/api';

	import Head from '$lib/components/Head.svelte';
	import PackageMenu from './PackageMenu.svelte';
	import Package from './Package.svelte';
	import PatchItem from './PatchItem.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Search from '$lib/components/Search.svelte';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import Query from '$lib/components/Query.svelte';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';

	const query = createQuery(['patches'], queries.patches);

	let searcher: Fuse<Patch> | undefined;

	let searchParams: Readable<URLSearchParams>;
	if (building) {
		searchParams = readable(new URLSearchParams());
	} else {
		searchParams = derived(page, ($page) => $page.url.searchParams);
	}

	$: selectedPkg = $searchParams.get('pkg');
	let searchTerm = $searchParams.get('s') || '';

	let mobilePackages = false;
	let showAllVersions = false;

	function checkCompatibility(patch: Patch, pkg: string) {
		if (pkg === '') {
			return false;
		}
		return !!patch.compatiblePackages?.find((compat) => compat.name === pkg);
	}

	function filter(patches: Patch[], pkg: string, search?: string): Patch[] {
		if (!search) {
			if (pkg) return patches.filter((patch) => checkCompatibility(patch, pkg));
			else return patches;
		}

		if (!searcher) {
			searcher = new Fuse(patches, {
				keys: ['name', 'description', 'compatiblePackages.name', 'compatiblePackages.versions'],
				shouldSort: true,
				threshold: 0.3
			});
		}

		const result = searcher
			.search(search)
			.map(({ item }) => item)
			.filter((item) => {
				// Don't show if the patch doesn't support the selected package
				if (pkg && !checkCompatibility(item, pkg)) {
					return false;
				}
				return true;
			});
		return result;
	}

	// Make sure we don't have to filter the patches after every key press
	let displayedTerm = '';
	const debounce = <T extends any[]>(f: (...args: T) => void) => {
		let timeout: number;
		return (...args: T) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => f(...args), 350);
		};
	};
	const update = () => {
		displayedTerm = searchTerm;

		const url = new URL(window.location.href);
		url.pathname = '/patches';

		if (searchTerm) {
			url.searchParams.set('s', searchTerm);
		} else {
			url.searchParams.delete('s');
		}

		window.history.pushState(null, '', url);
	};

	onMount(update);
</script>

<Head
	title="Patches for ReVanced"
	description="Browse our rich collection of patches for ReVanced you can use to patch your favourite apps."
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
					name: 'Patches',
					item: 'https://revanced.app/patches'
				}
			]
		}
	]}
/>

<div class="search">
	<div class="search-contain">
		<!-- Must bind both variables: we get searchTerm from the text input, -->
		<Search
			bind:searchTerm
			bind:displayedTerm
			title="Search for patches"
			on:keyup={debounce(update)}
		/>
	</div>
</div>
<main>
	<div class="filter-chips" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
		<FilterChip
			selected={!!selectedPkg}
			dropdown
			on:click={() => (mobilePackages = !mobilePackages)}
		>
			{selectedPkg || 'Packages'}
		</FilterChip>
		<!-- <FilterChip check>Universal</FilterChip>
		<FilterChip>Patch options</FilterChip> -->
	</div>

	<Query {query} let:data>
		<div class="mobile-packages-Dialogue">
			<Dialogue bind:modalOpen={mobilePackages} fullscreen>
				<svelte:fragment slot="title">Packages</svelte:fragment>
				<div class="mobile-packages">
					<span
						on:click={() => (mobilePackages = !mobilePackages)}
						on:keypress={() => (mobilePackages = !mobilePackages)}
					>
						<Package {selectedPkg} name="All packages" bind:searchTerm />
					</span>
					{#each data.packages as pkg}
						<span
							on:click={() => (mobilePackages = !mobilePackages)}
							on:keypress={() => (mobilePackages = !mobilePackages)}
						>
							<Package {selectedPkg} name={pkg} bind:searchTerm />
						</span>
					{/each}
				</div>
			</Dialogue>
		</div>

		<aside in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
			<PackageMenu>
				<span class="packages">
					<Package {selectedPkg} name="All packages" bind:searchTerm />
					{#each data.packages as pkg}
						<Package {selectedPkg} name={pkg} bind:searchTerm />
					{/each}
				</span>
			</PackageMenu>
		</aside>

		<div class="patches-container">
			{#each filter(data.patches, selectedPkg || '', displayedTerm) as patch}
				<!-- Trigger new animations when package or search changes (I love Svelte) -->
				{#key selectedPkg || displayedTerm}
					<div in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
						<PatchItem {patch} bind:showAllVersions />
					</div>
				{/key}
			{/each}
		</div>
	</Query>
</main>
<Footer />

<style>
	main {
		display: grid;
		grid-template-columns: 300px 3fr;
		width: min(90%, 80rem);
		margin-inline: auto;
		gap: 1.5rem;
	}

	.search {
		padding-top: 0.6rem;
		padding-bottom: 1.25rem;
		background-color: var(--surface-eight);
	}

	.search-contain {
		width: min(90%, 80rem);
		margin-inline: auto;
	}

	.patches-container {
		overflow: hidden;
		border-radius: 20px;
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: sticky;
		z-index: 1;
		min-height: calc(100vh - 6rem);
		margin-bottom: 3rem;
	}

	.filter-chips {
		display: none;
	}

	.mobile-packages {
		margin-bottom: -1px;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--border);
	}

	@media (min-width: 768px) {
		.mobile-packages-Dialogue {
			display: none;
		}
	}
	@media (max-width: 767px) {
		main {
			grid-template-columns: none;
			flex-direction: column;
			gap: 0;
		}

		aside {
			display: none;
		}

		.patches-container {
			margin-top: 1rem;
			margin-bottom: 1.5rem;
			gap: 0.75rem;
		}

		.filter-chips {
			display: flex;
			flex-wrap: wrap;
			margin-top: 1rem;
			gap: 0.75rem;
			padding-bottom: 0rem;
		}
	}
</style>
