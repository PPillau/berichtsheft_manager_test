import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.loading_spinner_container}>
      <div className={styles.loading_spinner}></div>
    </div>
  );
};

export default LoadingSpinner;
