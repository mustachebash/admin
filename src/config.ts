/**
 * Application configuration
 * This is the single source of truth for all environment-based configuration.
 * It abstracts the Vite-specific import.meta.env to named constants.
 */

export const API_HOST = import.meta.env.VITE_API_HOST;
export const TICKET_LINK_HOST = import.meta.env.VITE_TICKET_LINK_HOST;
export const BRAINTREE_HOST = import.meta.env.VITE_BRAINTREE_HOST;
export const BRAINTREE_MERCHANT_ID = import.meta.env.VITE_BRAINTREE_MERCHANT_ID;
export const EVENT_2020_ID = import.meta.env.VITE_EVENT_2020_ID;
export const EVENT_2022_ID = import.meta.env.VITE_EVENT_2022_ID;
