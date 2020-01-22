import './Transaction.less';

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'utils/apiClient';

const Transaction = ({ id }) => {
	const [transaction, setTransaction] = useState([]);

	useEffect(() => {
		apiClient.get(`/transactions/${id}`)
			.then(setTransaction)
			.catch(e => console.error('Transaction API Error', e));
	}, [id]);

	return (
		<div className="transaction">
			{JSON.stringify(transaction)}
		</div>
	);
};

Transaction.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Transaction);
