<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import Close from 'svelte-material-icons/Close.svelte';
	import Magnify from 'svelte-material-icons/Magnify.svelte';

	export let title: string;
	export let searchTerm: string | null;
	export let displayedTerm: string | undefined;

	function clear() {
		searchTerm = '';
		displayedTerm = '';

		const url = new URL($page.url);
		url.searchParams.delete('s');
		goto(url.pathname + url.search);
	}
</script>

<div class="search-container">
	<div id="search">
		<Magnify size="24px" color="var(--surface-six)" />
	</div>
	{#if searchTerm}
		<div
			id="clear"
			on:click={clear}
			on:keypress={clear}
			transition:fade={{ easing: quintOut, duration: 250 }}
		>
			<Close size="24px" color="var(--surface-six)" />
		</div>
	{/if}
	<input
		type="text"
		class:clear={searchTerm}
		placeholder={title}
		bind:value={searchTerm}
		on:keyup
	/>
</div>

<style lang="scss">
	#search {
		/* umm dont ask */
		position: absolute;
		z-index: 1;
		left: 16px;
		top: 14px;
		height: 24px;
	}

	#clear {
		position: absolute;
		right: 16px;
		top: 14px;
		z-index: 1;
		height: 24px;
		cursor: pointer;
	}

	.search-container {
		position: relative;
	}

	input {
		position: relative;
		display: flex;
		padding: 1rem 3.25rem;
		width: 100%;
		color: var(--secondary);
		font-weight: 500;
		font-size: 0.92rem;
		border-radius: 100px;
		border: none;
		background-color: var(--surface-nine);
		outline: none;

		transition: background-color 0.3s var(--bezier-one);
		&:hover {
			background-color: var(--surface-five);
		}

		&:focus::placeholder {
			color: var(--primary);
		}
		&:focus {
			background-color: var(--surface-two);
		}
	}

	input::placeholder {
		color: var(--text-four);
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s var(--bezier-one);
	}
</style>
