import './TicketsList.less';

import React from 'react';
import PropTypes from 'prop-types';

const TicketsList = ({ tickets }) => (
	<ul className="tickets-list">
		{tickets.map(({
			id,
			createdBy,
			status
		}) => <li key={id}>{id.substring(0, 8)} - {status} {createdBy !== 'purchase' && `(${createdBy})`}</li>)}
	</ul>
);

TicketsList.propTypes = {
	tickets: PropTypes.array.isRequired
};

export default TicketsList;
