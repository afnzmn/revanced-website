<script>
	import HeroImage from '$layout/Hero/HeroImage.svelte';
	import Home from '$layout/Hero/HeroSection.svelte';
	import SocialHost from '$layout/Hero/SocialHost.svelte';
	import Wave from '$lib/components/Wave.svelte';
	import Footer from '$layout/Footer/FooterHost.svelte';
	import Head from '$lib/components/Head.svelte';

	let scrollY = 0;
	let footerVisible = false;

	$: footerVisible = scrollY >= 10;
</script>

<svelte:window bind:scrollY />

<Head
	schemas={[
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			url: 'https://revanced.app/',
			logo: 'https://revanced.app/logo.png'
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://revanced.app/'
				}
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'What is ReVanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced is an <b>open-source patcher</b> for <b>Android apps</b>. With ReVanced we <b>continue the legacy of Vanced</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'How to get ReVanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'You can follow <a href="https://github.com/revanced/revanced-manager/tree/main/docs">ReVanced Manager documentation</a> to use <b>ReVanced Manager</b> or the <a href="https://github.com/revanced/revanced-cli/tree/main/docs">ReVanced CLI documentation</a> to use <b>ReVanced CLI</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'How does it work?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced uses a technique called <b>patching</b>. It patches <b>your choice of an app</b> and adds <b>new features</b> to it. Thanks to the <b>modularity of ReVanced</b>, you can choose <b>any combination of features you want</b> to use.'
					}
				},
				{
					'@type': 'Question',
					name: 'Does ReVanced support non-rooted devices?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: '<b>Yes</b>! ReVanced supports <b>non-root and rooted devices</b>.'
					}
				},
				{
					'@type': 'Question',
					name: 'Is ReVanced affiliated with Vanced?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'ReVanced is <b>not affiliated</b> with Vanced.'
					}
				},
				{
					'@type': 'Question',
					name: 'How can I help?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Since we are an <b>open-source community</b> and depend on outside help, you can always check out our <a href="https://github.com/revanced">GitHub repositories</a> and <b>contribute to ReVanced</b> by creating an issue or pull requests.'
					}
				}
			]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'ReVanced Manager',
			operatingSystem: 'ANDROID',
			applicationCategory: 'UtilitiesApplication',
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: '4.0',
				ratingCount: '100'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'ReVanced CLI',
			operatingSystem: 'All',
			applicationCategory: 'UtilitiesApplication',
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: '4.0',
				ratingCount: '30'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		}
	]}
/>

<main style={footerVisible ? '' : `height: 100vh;`} class:hidden={footerVisible}>
	<div class="wrap">
		<div class="wrappezoid">
			<Home />
			<div id="heroimg"><HeroImage /></div>
		</div>
	</div>
	<div class="hide-on-scroll" class:hidden={footerVisible}>
		<Wave />
		<SocialHost />
	</div>
</main>
<div class="footer">
	<Footer showDivider={footerVisible ? true : false} />
</div>

<style lang="scss">
	.hide-on-scroll {
		transition: opacity 0.5s var(--bezier-one);
		z-index: -999;

		&.hidden {
			height: 0;
			opacity: 0;
		}
	}
	main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
		transition:
			gap 0.5s var(--bezier-one),
			margin-bottom 0.5s var(--bezier-one);

		&.hidden {
			gap: 0rem;
			margin-bottom: 0rem;
		}
	}
	.wrap {
		margin-inline: auto;
		width: min(87%, 100rem);
	}
	.wrappezoid {
		height: calc(100vh - 225px);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 22rem;
	}

	.footer {
		background-color: var(--background-one);
	}

	@media (max-width: 1700px) {
		.wrappezoid {
			justify-content: space-between;
		}
	}
	@media (max-width: 1052px) {
		#heroimg {
			display: none;
		}
	}
	@media (max-width: 767px) {
		.wrappezoid {
			justify-content: center;
			height: calc(65vh);
		}
	}
</style>
