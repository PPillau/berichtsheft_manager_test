import styles from './UserSettings.module.scss';

import { Paper, Button, TextField, Grid } from '@material-ui/core';

import { Save } from '@material-ui/icons';

import { useHistory } from 'react-router-dom';
import GoBackBar from '../GoBackBar';
import { useState, useEffect, Fragment, useRef } from 'react';

import LoadingSpinner from '../LoadingSpinner';

import api from '../api';

import { useAuth } from '../AuthProvider';

const RecordView = ({ editable, addable }) => {
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {}, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.recordView_container}>
      <GoBackBar />
      <Paper elevation={3} className={styles.userSettings_container_inner}>
        <form onSubmit={handleSubmit}>
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
              Wochenanfang:
            </Grid>
            <Grid item xs={9}>
              <TextField name='beginOfWeek' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' color='primary' type='submit'>
                <Save style={{ marginRight: '10px' }} /> Speichern
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default RecordView;
