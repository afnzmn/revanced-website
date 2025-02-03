<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Patch } from '$lib/types';
	import Button from '$lib/components/Button.svelte';

	import ChevronDown from 'svelte-material-icons/ChevronDown.svelte';

	export let patch: Patch;
	export let showAllVersions: boolean;
	let expanded: boolean = false;

	const options = Object.entries(patch.options).map(([optionKey, option]) => ({
		optionKey,
		...option
	}));
	const hasPatchOptions = options.length > 0;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="patch-container"
	class:expanded={hasPatchOptions}
	class:rotate={expanded}
	on:click={() => (expanded = !expanded)}
>
	<div class="things">
		<div class="title">
			<h3>{patch.name}</h3>
		</div>
		{#if hasPatchOptions}
			<div class="expand-arrow">
				<ChevronDown size="24px" color="var(--surface-six)" />
			</div>
		{/if}
	</div>
	{#if patch.description}
		<h5>{patch.description}</h5>
	{/if}
	<ul class="info-container">
		{#if !patch.compatiblePackages}
			<li class="patch-info">🌎 Universal patch</li>
		{:else}
			{#each patch.compatiblePackages as pkg}
				<li class="patch-info">
					<a
						href="https://play.google.com/store/apps/details?id={pkg.name}"
						target="_blank"
						rel="noreferrer"
					>
						📦 {pkg.name}
					</a>
				</li>
			{/each}
		{/if}

		{#if hasPatchOptions}
			<li class="patch-info">⚙️ Patch options</li>
		{/if}

		<!-- Should this be hardcoded to get the version of the first package?  -->
		{#if patch.compatiblePackages?.length && patch.compatiblePackages[0].versions?.length}
			{#if showAllVersions}
				{#each patch.compatiblePackages[0].versions.reverse() as version}
					<li class="patch-info">
						🎯 {version}
					</li>
				{/each}
			{:else}
				<li class="patch-info">
					🎯 {patch.compatiblePackages[0].versions.slice(-1)}
				</li>
			{/if}
			{#if patch.compatiblePackages[0].versions.length > 1}
				<li class="button">
					<Button type="text" on:click={() => (showAllVersions = !showAllVersions)}>
						<div
							class="expand-arrow"
							style:transform={showAllVersions ? 'rotate(90deg)' : 'rotate(-90deg)'}
						>
							<ChevronDown size="24px" color="var(--surface-six)" />
						</div>
					</Button>
				</li>
			{/if}
		{:else}
			<li class="patch-info">🎯 Any version</li>
		{/if}
	</ul>

	{#if expanded && hasPatchOptions}
		<span transition:fade={{ easing: quintOut, duration: 1000 }}>
			<div class="options" transition:slide={{ easing: quintOut, duration: 500 }}>
				{#each options as option}
					<div class="option">
						<h5 id="option-title">{option.title}</h5>
						<h5>
							<pre id="option-description">{option.description}</pre>
						</h5>
					</div>
				{/each}
			</div>
		</span>
	{/if}
</div>

<style lang="scss">
	h3 {
		margin-right: 0.5rem;
		margin-bottom: 0.2rem;
		color: var(--primary);
	}

	#option-description {
		white-space: pre-wrap;
		word-break: break-word;
	}

	#option-title {
		color: var(--secondary);
	}

	.button {
		display: flex;
		align-items: center;
	}

	.patch-info {
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-four);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 8px;

		&:hover {
			background-color: var(--surface-four);
		}
	}

	a {
		text-decoration: none;
		color: var(--text-four);

		&:hover {
			text-decoration: underline var(--secondary);
			color: var(--secondary);
		}
	}

	.info-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.3rem 0rem;
		width: 100%;
		margin-top: 0.5rem;
	}

	.patch-container {
		transition: all 0.1s var(--bezier-one);
		background-color: var(--surface-seven);
		padding: 1.25rem;
		border-radius: 12px;
	}

	.title {
		display: flex;
		align-items: center;
	}

	.things {
		display: flex;
		justify-content: space-between;
	}

	.expand-arrow {
		transition: all 0.2s var(--bezier-one);
		user-select: none;
		height: 1.5rem;
	}

	.rotate .expand-arrow {
		transform: rotate(180deg);
	}

	.expanded {
		cursor: pointer;

		&:hover {
			background-color: var(--surface-three);
		}

		&:active {
			filter: brightness(1.15);
		}
	}

	.option {
		padding: 1rem;
	}

	/* thanks piknik */
	.option + .option {
		border-top: 1px solid var(--border);
	}

	.options {
		border: 1px solid var(--border);
		overflow: hidden;
		border-radius: 8px;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
	}
</style>
