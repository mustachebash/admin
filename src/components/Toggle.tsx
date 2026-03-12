import styles from './Toggle.module.css';

import React from 'react';
import classnames from 'classnames';

interface ToggleProps {
	toggleState: boolean;
	handleToggle: () => void;
}

const Toggle = ({ toggleState, handleToggle }: ToggleProps) => <div className={classnames(styles.toggle, { [styles.on]: toggleState })} onClick={handleToggle}></div>;

export default Toggle;
