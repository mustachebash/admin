import styles from './PromosListItem.module.css';

import { memo } from 'react';
import { format } from 'date-fns';
import { TICKET_LINK_HOST } from '@/config';

interface PromosListItemProps {
	promo: any;
	createdByName?: string;
	product: any;
	event: any;
	disablePromo: (id: string) => void;
}

const PromosListItem = ({ promo, createdByName, product, event, disablePromo }: PromosListItemProps) => (
	<li className={styles.promosListItem}>
		<div className={styles.status}>
			<span className={promo.status === 'claimed' ? styles.checked : ''} title={promo.status === 'claimed' ? format(new Date(promo.updated), 'MMM do, h:mma') : 'Not Claimed'}>
				{promo.status}
			</span>
		</div>
		<div className="recipient">
			<p>{promo.recipientName}</p>
		</div>
		<div className={styles.date}>
			<p>{format(new Date(promo.created), 'MMM do, h:mma')}</p>
		</div>
		<div className="event">
			<p>{event.name}</p>
		</div>
		<div className="product">
			<p title={`${promo.productQuantity}qty @ $${promo.price} - ${createdByName}`}>{product?.name}</p>
		</div>
		<div className={styles.link}>
			<p>
				<a href={`${TICKET_LINK_HOST}/san-diego?promo=${promo.id}#tickets`} rel="noopener noreferrer" target="_blank">
					Promo Link
				</a>
			</p>
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
