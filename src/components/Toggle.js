import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Toggle = ({ toggleState, handleToggle }) => (
	<div className={classnames('toggle', {on: toggleState})}  onClick={handleToggle}></div>
);

Toggle.propTypes = {
	toggleState: PropTypes.bool.isRequired,
	handleToggle: PropTypes.func.isRequired
};

export default Toggle;
