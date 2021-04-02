import {
  Paper,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
} from '@material-ui/core';
import { useState } from 'react';
import styles from '../styles/login.module.scss';
import { useAuth } from '../components/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import BodyWrapper from '../components/BodyWrappper';

const Login = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [user]);

  const [errors, setErrors] = useState({
    login: null,
    pass: null,
    general: null,
  });
  const [stayloggedin, setStayloggedln] = useState(false);
  const { login } = useAuth();

  const validate = (loginhandle, password) => {
    let loginError = null;
    let passError = null;
    if (loginhandle == '') {
      loginError = 'Dieses Feld darf nicht leer sein!';
    } else if (!/^\d+$/.test(loginhandle) && !loginhandle.includes(' ')) {
      loginError = 'Vollen Namen oder Identnummer eingeben';
    } else if (
      /^\d+$/.test(loginhandle.replace(/\s/g, '')) &&
      !/^\d+$/.test(loginhandle)
    ) {
      loginError = 'Vollen Namen oder Identnummer eingeben';
    } else {
      loginError = null;
    }

    if (password == '') {
      passError = 'Dieses Feld darf nicht leer sein!';
    } else {
      passError = null;
    }

    setErrors({ login: loginError, pass: passError, general: errors.general });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { loginhandle, password } = event.target;
    validate(loginhandle.value, password.value);
    let logintype;
    if (/^\d+$/.test(loginhandle)) {
      logintype = 0;
    } else {
      logintype = 1;
    }

    if (!errors.login && !errors.pass) {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginhandle: loginhandle.value,
          password: password.value,
          logintype,
        }),
      })
        .then((res) => {
          res.json().then((data) => {
            if (res.status == 201) {
              login(data.token, data.identnumber);
            } else if (res.status == 401 || res.status == 500) {
              setErrors({
                login: errors.login,
                pass: errors.pass,
                general: data.error,
              });
            }
          });
        })
        .catch((error) => {});
    }
  };

  const handleCheckboxChange = (event) => {
    setStayloggedln(!stayloggedin);
  };

  const resetPassword = (event) => {};

  return (
    <BodyWrapper>
      <Paper elevation={3} className={styles.login_container}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={!!errors.login}
                name='loginhandle'
                label='Identifikationsnummer oder Name'
                variant='filled'
                helperText={errors.login || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!!errors.pass}
                name='password'
                label='Passwort'
                variant='filled'
                type='password'
                helperText={errors.pass || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label='Angemeldet bleiben'
                control={
                  <Checkbox
                    name='stayloggedin'
                    checked={stayloggedin}
                    onChange={handleCheckboxChange}
                  />
                }
              />
            </Grid>
            {!!errors.general && (
              <Grid item xs={12}>
                <div className={styles.error_container}>{errors.general}</div>
              </Grid>
            )}
            <Grid item>
              <Button variant='contained' color='primary' type='submit'>
                Einloggen
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' onClick={resetPassword}>
                Passwort vergessen
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </BodyWrapper>
  );
};

export default Login;
