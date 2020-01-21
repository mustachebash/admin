import React, { useContext } from 'react';
import UserContext from 'UserContext';
import { checkScope } from 'utils';
import CompedGuestForm from '../components/CompedGuestForm';
import GuestsTable from '../components/GuestsTable';

const GuestsView = () => {
	const { user } = useContext(UserContext);

	return (
		<div id="guests-view" className="container-1230">
			{checkScope(user.role, 'admin') && <CompedGuestForm />}
			<GuestsTable />
		</div>
	);
};

export default GuestsView;
