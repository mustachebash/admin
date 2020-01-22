import './Guest.less';

import React, { useState, useEffect, useContext, memo } from 'react';
import PropTypes from 'prop-types';
import UserContext from 'UserContext';
import apiClient from 'utils/apiClient';

const Guest = ({ id }) => {
	const [guest, setGuest] = useState([]);

	const { user } = useContext(UserContext);

	useEffect(() => {
		apiClient.get(`/guests/${id}`)
			.then(setGuest)
			.catch(e => console.error('Guest API Error', e));
	}, [id]);

	return (
		<div className="guest">
			{JSON.stringify(guest)}
		</div>
	);
};

Guest.propTypes = {
	id: PropTypes.string.isRequired
};

export default memo(Guest);
