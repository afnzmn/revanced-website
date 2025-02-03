<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { TeamMember } from '$lib/types';
	import ToolTip from '$lib/components/ToolTip.svelte';

	import CheckDecagramOutline from 'svelte-material-icons/CheckDecagramOutline.svelte';

	export let member: TeamMember;
	export let i: number;

	const transitionOptions = {
		y: 10,
		easing: quintOut,
		duration: 750,
		delay: 50 * i
	};
</script>

<div class="member">
	<a href={member.url} rel="noreferrer" target="_blank" in:fly|global={transitionOptions}>
		<img src={member.avatar_url} alt="{member.name}'s profile picture." />
	</a>
	<div class="member-text">
		<div class="member-title">
			<a href={member.url} rel="noreferrer" target="_blank" in:fly|global={transitionOptions}>
				<h4>{member.name}</h4>
			</a>
			<div class="verified-badge">
				<ToolTip
					content="<p>GPG key ID:</p> <a class='gpg-url' href={member.gpg_key
						.url} rel='noreferrer' target='_blank'>{member.gpg_key.id}</a>"
					html={true}
				>
					<div class="desktop">
						<a href={member.gpg_key.url} rel="noreferrer" target="_blank">
							<CheckDecagramOutline size="20px" color="var(--secondary)" />
						</a>
					</div>
					<div class="mobile">
						<CheckDecagramOutline size="20px" color="var(--secondary)" />
						<h5>GPG key</h5>
					</div>
				</ToolTip>
			</div>
		</div>
		{#if member.bio}
			<h6>{member.bio}</h6>
		{/if}
	</div>
</div>

<style lang="scss">
	a {
		text-decoration: none;
	}

	.member {
		width: 100%;
		color: var(--text-one);
		border: 1px solid var(--border);
		padding: 1rem;
		border-radius: 12px;
		display: flex;
		gap: 1rem;
		transition: 0.3s background-color var(--bezier-one);

		&:hover {
			background-color: var(--surface-seven);
		}
	}

	.member-text {
		display: flex;
		flex-direction: column;
		word-break: break-word;

		.member-title {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			.verified-badge {
				display: flex;
				align-items: center;
				fill: var(--secondary) !important;
				line-height: 16px;
				height: 16px;

				.mobile {
					display: none;
				}
				@media screen and (width <= 768px) {
					.desktop {
						display: none;
					}
					.mobile {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						gap: 0.25rem;
					}
				}
			}
		}
	}

	img {
		border-radius: 50%;
		height: 64px;
		width: 64px;
		transition: transform 0.4s var(--bezier-one);
		user-select: none;
		margin-bottom: 1rem;

		@media screen and (max-width: 768px) {
			margin-bottom: 0;
			height: 48px;
			width: 48px;
		}
	}
</style>
