<script lang="ts">
	import { queries } from '$data/api';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { createQuery } from '@tanstack/svelte-query';

	import manager_screenshot from '$images/manager.png?format=avif;webp;png&as=picture';

	import TrayArrowDown from 'svelte-material-icons/TrayArrowDown.svelte';

	import Head from '$lib/components/Head.svelte';
	import Query from '$lib/components/Query.svelte';
	import Button from '$lib/components/Button.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Picture from '$lib/components/Picture.svelte';
	import Dialogue from '$lib/components/Dialogue.svelte';
	import { onMount } from 'svelte';

	const query = createQuery(['manager'], queries.manager);

	let warning: string;
	let warningDialogue = false;

	let userAgent: string;
	let isAndroid: boolean;
	let androidVersionMatch: RegExpExecArray | null;
	let androidVersion: number;

	onMount(() => {
		userAgent = navigator.userAgent;
		androidVersionMatch = /Android\s([\d.]+)/i.exec(userAgent);
		androidVersion = androidVersionMatch ? parseInt(androidVersionMatch[1]) : 0;
		isAndroid = !!androidVersion;
	});

	function handleClick() {
		if (!isAndroid) {
			warning = 'Your device is not running Android.';
			warningDialogue = true;
		} else if (androidVersion < 8) {
			warning = `Your device is running ${androidVersion}. ReVanced only supports Android versions 8 and above.`;
			warningDialogue = true;
		}
	}
</script>

<Head
	title="Download ReVanced"
	description="Download ReVanced Manager to patch your favourite apps, right on your device."
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
					item: 'https://revanced.app/download'
				}
			]
		}
	]}
/>

<Dialogue bind:modalOpen={warningDialogue}>
	<svelte:fragment slot="title">Warning</svelte:fragment>
	<svelte:fragment slot="description">{warning} Do you still want to download?</svelte:fragment>
	<svelte:fragment slot="buttons">
		<Query {query} let:data>
			<Button
				type="text"
				href={data.release.download_url}
				on:click={() => (warningDialogue = false)}>Okay</Button
			>
		</Query>
		<Button type="text" on:click={() => (warningDialogue = false)}>Cancel</Button>
	</svelte:fragment>
</Dialogue>

<div class="wrapper center" in:fly={{ y: 10, easing: quintOut, duration: 750 }}>
	<h2>ReVanced <span>Manager</span></h2>
	<p>Patch your favourite apps, right on your device.</p>
	<div class="buttons">
		<Query {query} let:data>
			{#if !isAndroid || androidVersion < 8}
				<Button on:click={handleClick} icon={TrayArrowDown} type="filled">
					{data.release.version}
				</Button>
			{:else}
				<Button
					on:click={handleClick}
					icon={TrayArrowDown}
					type="filled"
					href={data.release.download_url}
				>
					{data.release.version}
				</Button>
			{/if}
		</Query>
		<Button type="tonal" href="https://github.com/revanced/revanced-manager" target="_blank">
			View Source
		</Button>
	</div>
	<div class="screenshot">
		<Picture data={manager_screenshot} alt="Manager Screenshot" />
	</div>
</div>

<Footer />

<style>
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h2 {
		text-align: center;
		color: var(--text-one);
	}

	p {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.screenshot :global(img) {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
		height: 50rem;
		width: auto;
		padding: 0.5rem 0.5rem;
		border-radius: 2rem;
		background-color: var(--surface-seven);
		user-select: none;
	}

	.buttons {
		display: flex;
		gap: 1rem;
	}

	span {
		color: var(--primary);
	}
</style>
