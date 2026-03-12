import styles from './FlexRow.module.css';
import classnames from 'classnames';

interface FlexRowProps extends React.HTMLAttributes<HTMLElement> {
	as?: React.ElementType;
	noMobileStack?: boolean;
	className?: string;
	children?: React.ReactNode;
}

const FlexRow = ({ as: Tag = 'div', noMobileStack = false, className, children, ...props }: FlexRowProps) => (
	<Tag className={classnames(styles.flexRow, { [styles.noMobileStack]: noMobileStack }, className)} {...props}>
		{children}
	</Tag>
);

export default FlexRow;
