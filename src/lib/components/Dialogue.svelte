<script lang="ts">
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	import ArrowLeft from 'svelte-material-icons/ArrowLeft.svelte';

	export let modalOpen = false;
	export let fullscreen = false;
	export let notDismissible = false;

	let element: HTMLDivElement;
	let y = 0;

	function parseScroll() {
		y = element.scrollTop;
	}
</script>

{#if modalOpen}
	<div
		class="overlay"
		on:click={() => {
			if (!notDismissible) modalOpen = !modalOpen;
		}}
		on:keypress={() => {
			if (!notDismissible) modalOpen = !modalOpen;
		}}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	/>

	<div
		class="modal"
		role="dialog"
		class:fullscreen
		class:scrolled={y > 10}
		aria-modal="true"
		bind:this={element}
		on:scroll={parseScroll}
		transition:fade={{ easing: quadInOut, duration: 150 }}
	>
		<div class="top">
			<div class="title" class:hasIcon={$$slots.icon}>
				{#if fullscreen}
					<button id="back-button" on:click={() => (modalOpen = !modalOpen)}>
						<ArrowLeft size="24px" color="var(--surface-six)" />
					</button>
				{/if}
				{#if $$slots.icon}
					<slot name="icon" />
				{/if}
				{#if $$slots.title}
					<h3>
						<slot name="title" />
					</h3>
				{/if}
			</div>

			{#if $$slots.description}
				<p>
					<slot name="description" />
				</p>
			{/if}

			<div class="slot"><slot /></div>

			{#if $$slots.buttons}
				<div class="buttons">
					<slot name="buttons" />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		background-color: var(--surface-seven);
	}

	.buttons {
		display: flex;
		gap: 2rem;
		justify-content: flex-end;
		width: 100%;
	}

	#back-button {
		cursor: pointer;
	}

	.hasIcon {
		flex-direction: column;
	}

	.modal {
		position: fixed;
		width: min(85%, 425px);
		max-height: 75%;
		overflow-y: scroll;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 26px;
		background-color: var(--surface-seven);
		display: flex;
		gap: 5%;
		white-space: normal;
		display: flex;
		flex-direction: column;
		gap: 2px;
		z-index: 1001;
		padding: 32px;
		box-shadow:
			0px 4px 5px 0px rgba(0, 0, 0, 0.14),
			0px 1px 10px 0px rgba(0, 0, 0, 0.12),
			0px 2px 4px -1px rgba(0, 0, 0, 0.2);
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	button {
		padding: 0;
		margin: 0;
		border: none;
		background-color: transparent;
		display: flex;
		align-items: center;
	}

	.fullscreen {
		padding: 0;
		max-height: 100%;
		width: 100%;
		border-radius: 0;
	}

	.fullscreen .slot {
		padding: 0 32px 32px;
	}

	.fullscreen .title {
		justify-content: flex-start;
		position: sticky;
		padding: 32px;
		padding-bottom: 0.75rem;
		top: 0;
		left: 0;
	}

	.fullscreen.scrolled .title {
		border-bottom: 1px solid var(--border);
	}

	.slot {
		display: flex;
		flex-direction: column;
		align-content: center;
		width: 100%;
	}

	.modal::-webkit-scrollbar {
		display: none;
	}
</style>
