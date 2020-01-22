import React from 'react';
import { useParams } from 'react-router-dom';
import Guest from '../components/Guest';

const GuestsView = () => {
	const { id } = useParams();

	return (
		<div className="guest-view container-1230">
			<Guest id={id} />
		</div>
	);
};

export default GuestsView;
