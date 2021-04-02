import styles from './BodyWrapper.module.scss';

const BodyWrapper = ({ children }) => {
  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BodyWrapper;
