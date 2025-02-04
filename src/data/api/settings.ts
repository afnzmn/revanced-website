import { browser } from '$app/environment';
import { RV_API_URL } from '$env/static/public';

export const default_api_url = RV_API_URL;

const URL_KEY = 'revanced_api_url';
const STATUS_KEY = 'revanced_status_url';

function set_status_url(apiUrl: string) {
	fetch(`${apiUrl}/v4/about`)
		.then((response) => (response.ok ? response.json() : null))
		.then((data) => {
			if (data?.status) {
				localStorage.setItem(STATUS_KEY, data.status);
				console.log('status is now ' + localStorage.getItem(STATUS_KEY));
			}
		});
}

// Get base URL
export function api_base_url(): string {
	if (browser) {
		const apiUrl = localStorage.getItem(URL_KEY) || default_api_url;

		if (!localStorage.getItem(STATUS_KEY)) {
			set_status_url(apiUrl);
		}

		return apiUrl;
	}

	return default_api_url;
}

export function status_url(): string | null {
	if (browser) {
		return localStorage.getItem(STATUS_KEY) || null;
	}

	return null;
}

// (re)set base URL.
export function set_api_base_url(url?: string) {
	if (!url) {
		localStorage.removeItem(URL_KEY);
	} else {
		localStorage.setItem(URL_KEY, url);
		set_status_url(url);
	}
}
