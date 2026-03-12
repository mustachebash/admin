import styles from './FlexItem.module.css';
import classnames from 'classnames';

interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const FlexItem = ({ className, children, ...props }: FlexItemProps) => (
  <div className={classnames(styles.flexItem, className)} {...props}>
    {children}
  </div>
);

export default FlexItem;
