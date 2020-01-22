import React from 'react';
import { useParams } from 'react-router-dom';
import Transaction from '../components/Transaction';

const TransactionView = () => {
	const { id } = useParams();

	return (
		<div className="transaction-view container-1230">
			<Transaction id={id} />
		</div>
	);
};

export default TransactionView;
