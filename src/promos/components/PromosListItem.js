import './PromosListItem.less';

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const PromosListItem = ({ promo, product, event }) => (
	<li className="promos-list-item">
		<div className="status">
			<span
				className={promo.status === 'claimed' ? 'checked' : ''}
				title={promo.status === 'claimed' ? format(new Date(promo.updated), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'}) : 'Not Claimed'}
			>
				{promo.status}
			</span>
		</div>
		<div className="recipient">
			<p>{promo.recipient}</p>
		</div>
		<div className="date">
			<p>{format(new Date(promo.created), 'MMM Do, h:mma', {timeZone: 'America/Los_Angeles'}) }</p>
		</div>
		<div className="event">
			<p>{event.name}</p>
		</div>
		<div className="product">
			<p title={`$${promo.price} - ${promo.createdBy}`}>{product?.name}</p>
		</div>
		<div className="link">
			<p><a href={`https://mustachebash.com/?promo=${promo.id}#tickets`} rel="noopener noreferrer" target="_blank">Promo Link</a></p>
		</div>
		<div className="edit-promo">
			{/* TODO: add ability to disable promo */}
			<p>{!['claimed', 'disabled'].includes(promo.status) && <a href="#" onClick={() => {}}>&#x274C;</a>}</p>
		</div>
	</li>
);

PromosListItem.propTypes = {
	product: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	promo: PropTypes.object.isRequired
};

export default memo(PromosListItem);
