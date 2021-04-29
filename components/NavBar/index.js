import Link from 'next/link';
import styles from './Navbar.module.scss';
import { useState, useRef, createContext, useContext } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useAuth } from '../AuthProvider';

const NavBar = () => {
  const { user, logout } = useAuth();
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                Identifikationsnummer:
                <span className={styles.content_label}>{user.identnumber}</span>
              </Grid>
              <Grid item xs={12}>
                Ausbildungsjahr:
                <span className={styles.content_label}>
                  {user.apprenticeshipyear}
                </span>
              </Grid>
              <Grid item xs={12}>
                <Button variant='outlined'>Profil bearbeiten</Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' onClick={logout}>
                  Ausloggen
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
