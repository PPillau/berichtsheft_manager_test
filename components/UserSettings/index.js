import styles from './UserSettings.module.scss';

import { Paper, Button, TextField, Grid } from '@material-ui/core';

import { Save, Clear } from '@material-ui/icons';

import { useHistory } from 'react-router-dom';
import GoBackBar from '../GoBackBar';
import { useState, useEffect, Fragment, useRef } from 'react';

import LoadingSpinner from '../LoadingSpinner';

import api from '../api';

import { useAuth } from '../AuthProvider';

const RecordView = ({ editable, addable }) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [statusMessage, setStatusMessage] = useState(null);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { zipcode, street, email } = event.target;
    setLoading(true);
    await sleep(200);
    api
      .post(`/auth/user/${user.identnumber}/update`, {
        email: email.value,
        zipcode: zipcode.value,
        street: street.value,
      })
      .then((response) => {
        if (response.status == 200) {
          setLoading(false);
          console.log(
            response.data,
            '-----------------------------------------'
          );
          setUser(response.data);

          setStatusMessage({
            type: 'success',
            message: 'Benutzerdaten wurde aktualisiert!',
          });

          return;
        }
      })
      .catch((error) => {
        setLoading(false);
        setStatusMessage({
          type: 'error',
          message:
            'Es ist ein Problem beim Aktualisieren der Benuterdaten aufgetreten!',
        });
      });
  };

  const dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const closeStatusMessage = () => {
    setStatusMessage(null);
  };

  return (
    <div className={styles.userSettings_container}>
      <GoBackBar />
      {loading && <LoadingSpinner />}
      {!loading && statusMessage && (
        <div
          className={[
            styles.recordView_container_inner,
            statusMessage.type == 'success'
              ? styles.success_container
              : styles.error_container,
          ].join(' ')}
        >
          {statusMessage.message}
          <Clear
            className={
              statusMessage.type == 'success'
                ? styles.clear_button_success
                : styles.clear_button_error
            }
            onClick={closeStatusMessage}
          ></Clear>
        </div>
      )}
      {!loading && (
        <Paper elevation={3} className={styles.userSettings_container_inner}>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <h2 className={styles.userSettings_label}>
                <span className={styles.user_image}></span>
                {user.firstname} {user.surname}
              </h2>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3} className={styles.userSettings_label}>
                Identifikationsnummer:
              </Grid>
              <Grid item xs={9}>
                <TextField
                  value={user.identnumber}
                  name='identnumber'
                  variant='outlined'
                  disabled
                />
              </Grid>
              <Grid item xs={3} className={styles.userSettings_label}>
                EMail-Adresse:
              </Grid>
              <Grid item xs={5}>
                <TextField
                  defaultValue={user.email}
                  name='email'
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={3} className={styles.userSettings_label}>
                Geburtsdatum:
              </Grid>
              <Grid item xs={9}>
                <TextField
                  value={new Date(user.dateofbirth).toLocaleDateString(
                    'de-DE',
                    dateOptions
                  )}
                  name='dateofbirth'
                  variant='outlined'
                  disabled
                />
              </Grid>
              <Grid item xs={3} className={styles.userSettings_label}>
                Wohnort:
              </Grid>
              <Grid item xs={5}>
                <TextField
                  defaultValue={user.zipcode}
                  name='zipcode'
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={3} className={styles.userSettings_label}>
                Straße:
              </Grid>
              <Grid item xs={5}>
                <TextField
                  defaultValue={user.street}
                  name='street'
                  variant='outlined'
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={3} className={styles.userSettings_label}>
                Ausbildungsjahr:
              </Grid>
              <Grid item xs={1}>
                <TextField
                  defaultValue={user.apprenticeshipyear}
                  name='apprenticeshipyear'
                  variant='outlined'
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={12}>
                <Button variant='contained' color='primary' type='submit'>
                  <Save style={{ marginRight: '10px' }} /> Speichern
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
    </div>
  );
};

export default RecordView;
