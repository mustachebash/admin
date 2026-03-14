import styles from './PromosListItem.module.css';

import { memo } from 'react';
import { format } from 'date-fns';
import { TICKET_LINK_HOST } from '@/config';

interface PromosListItemProps {
	type: 'single-use' | 'coupon';
	promo: any;
	createdByName?: string;
	product: any;
	disablePromo: (id: string) => void;
}

const PromosListItem = ({ type, promo, createdByName, product, disablePromo }: PromosListItemProps) => (
	<li className={`${styles.promosListItem}${['claimed', 'disabled'].includes(promo.status) ? ` ${styles.claimed}` : ''}`}>
		<div className={styles.status}>
			<span title={promo.status === 'claimed' ? format(new Date(promo.updated), 'MMM do, h:mma') : ''}>
				{promo.status}
			</span>
		</div>
		{type === 'single-use' && (
			<div className="recipient">
				<p>{promo.recipientName}</p>
			</div>
		)}
		{type === 'coupon' && (
			<div className="discount">
				<p>{promo.percentDiscount ? `${promo.percentDiscount}% off` : `$${promo.flatDiscount} off`}</p>
			</div>
		)}
		<div className={styles.date}>
			<p>{format(new Date(promo.created), 'MMM do, h:mma')}</p>
		</div>
		{type === 'coupon' && (
			<div className={`meta ${styles.meta}`}>
				{Object.entries(promo.meta ?? {}).map(([k, v]) => (
					<p key={k}>{k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}</p>
				))}
			</div>
		)}
		<div className={styles.link}>
			{!['claimed', 'disabled'].includes(promo.status) && (
				<p>
					<a href={`${TICKET_LINK_HOST}/san-diego?promo=${promo.id}#tickets`} rel="noopener noreferrer" target="_blank">
						Promo Link
					</a>
				</p>
			)}
		</div>
		<div className={styles.editPromo}>
			{/* TODO: add ability to disable promo */}
			<p>
				{!['claimed', 'disabled'].includes(promo.status) && (
					<a href="#" onClick={e => (e.preventDefault(), disablePromo(promo.id))}>
						&#x274C;
					</a>
				)}
			</p>
		</div>
	</li>
);

export default memo(PromosListItem);
