/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_HOST: string;
	readonly VITE_TICKET_LINK_HOST: string;
	readonly VITE_BRAINTREE_HOST: string;
	readonly VITE_BRAINTREE_MERCHANT_ID: string;
	readonly VITE_EVENT_2020_ID: string;
	readonly VITE_EVENT_2022_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
