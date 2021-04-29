import styles from './GoBackBar.module.scss';

import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

const GoBackBar = () => {
  const history = useHistory();

  const goBack = () => {
    history.push('/');
  };

  return (
    <div className={styles.goBackBar_container}>
      <Button variant='contained' size='small' color='primary' onClick={goBack}>
        &lt; zurück
      </Button>
    </div>
  );
};

export default GoBackBar;
