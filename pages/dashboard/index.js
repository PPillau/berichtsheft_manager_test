import LoadingSpinner from '../../components/LoadingSpinner';
import BodyWrapper from '../../components/BodyWrappper';
import styles from './dashboard.module.scss';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useAuth } from '../../components/AuthProvider';

const dashboard = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const user_container_ref = useRef(null);
  const [userContainerStyles, setUserContainerStyles] = useState({});
  const [userContainerShadowStyles, setUserContainerShadowStyles] = useState(
    {}
  );
  const user_container_content_ref = useRef(null);
  const makeContainerVisible = () => {
    setUserContainerStyles({
      height:
        user_container_content_ref.current.clientHeight +
        parseInt(styles.navbar_height, 10) +
        'px',
    });
    setUserContainerShadowStyles({
      height: user_container_content_ref.current.clientHeight + 'px',
    });
    setVisible(true);
  };

  const makeContainerInvisible = () => {
    setUserContainerStyles({
      height: styles.navbar_height,
    });
    setUserContainerShadowStyles({
      height: styles.navbar_height,
    });
    setVisible(false);
  };

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.navbar_content}>
          <h1>Berichtsheft-Manager</h1>
          <div
            className={visible ? styles.outer_shadow : ''}
            style={userContainerShadowStyles}
          ></div>

          <div
            className={styles.user_container}
            ref={user_container_ref}
            onMouseEnter={makeContainerVisible}
            onMouseLeave={makeContainerInvisible}
            style={userContainerStyles}
          >
            <div className={styles.user_container_header}>
              <Link href='/user'>
                <a className={styles.userlink_header}>
                  <span className={styles.user_image}></span>
                  {user.firstname} {user.surname}
                </a>
              </Link>
            </div>
            <div
              className={styles.user_container_content}
              ref={user_container_content_ref}
            >
              Identifikationsnummer: {user.identnumber}
            </div>
          </div>
        </div>
      </div>
      <BodyWrapper>Dashboard</BodyWrapper>
    </div>
  );
};

export default dashboard;
