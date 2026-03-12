import styles from './Container.module.css';
import classnames from 'classnames';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	children?: React.ReactNode;
}

const Container = ({ className, children, ...props }: ContainerProps) => (
	<div className={classnames(styles.container, className)} {...props}>
		{children}
	</div>
);

export default Container;
