import styles from './RecordView.module.scss';

import {
  Paper,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
  Chip,
} from '@material-ui/core';

import {
  PictureAsPdf,
  CancelOutlined,
  CheckCircleOutlineOutlined,
  HelpOutlineOutlined,
  Edit,
  ErrorOutlineOutlined,
  Visibility,
  Save,
  Send,
} from '@material-ui/icons';

import { useParams } from 'react-router-dom';

import { useHistory } from 'react-router-dom';
import GoBackBar from '../GoBackBar';
import { useState, useEffect, Fragment, useRef } from 'react';

import LoadingSpinner from '../LoadingSpinner';

import api from '../api';

import { useAuth } from '../AuthProvider';

const RecordView = ({ editable, addable }) => {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [record, setRecord] = useState({});
  const [recordNumber, setRecordNumber] = useState(0);

  const { id } = useParams();
  const { user } = useAuth();
  const history = useHistory();

  const beginOfWeek_ref = useRef(null);
  const endOfWeek_ref = useRef(null);
  const text_ref = useRef(null);

  useEffect(() => {
    if (!id && !addable) {
      history.push('/');
    }

    if (!addable) {
      api.get(`/records/${user.identnumber}/${id}`).then((recordResponse) => {
        if (recordResponse.status == 200) {
          setRecord(recordResponse.data.record);
        }
        setLoading(false);
      });
    } else {
      api.get(`/records/${user.identnumber}/number`).then((numberResponse) => {
        if (numberResponse.status == 200) {
          if (numberResponse.data.number >= 0) {
            setRecordNumber(numberResponse.data.number);
          } else {
            setRecordNumber(0);
          }
        }
        setLoading(false);
      });
    }
  }, []);

  const dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Ausstehend';
        break;
      case 1:
        return 'Noch nicht abgeschickt';
        break;
      case 2:
        return 'Genehmigt';
        break;
      case 3:
        return 'Abgelehnt';
        break;
      default:
        return 'Noch nicht gespeichert / abgeschickt';
        break;
    }
  };

  const getStatusColorProp = (status) => {
    switch (status) {
      case 0:
        return { color: 'primary' };
        break;
      case 1:
        return {};
        break;
      case 2:
        return { style: { backgroundColor: 'green' } };
        break;
      case 3:
        return { color: 'secondary' };
        break;
      default:
        return {};
        break;
    }
  };

  const pdfClick = () => {
    history.push(`/pdf/${id}?return=1`);
  };

  const switchToEditClick = () => {
    history.push(`/edit/${id}`);
  };

  const saveRecordClick = () => {
    if (addable) {
      createRecord({
        beginOfWeek: beginOfWeek_ref.current.value,
        endOfWeek: endOfWeek_ref.current.value,
        text: text_ref.current.value,
        isSafe: true,
      });
    } else {
      saveRecord({
        beginOfWeek: beginOfWeek_ref.current.value,
        endOfWeek: endOfWeek_ref.current.value,
        text: text_ref.current.value,
        isSafe: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { beginOfWeek, endOfWeek, text } = event.target;

    if (addable) {
      createRecord({
        beginOfWeek: beginOfWeek.value,
        endOfWeek: endOfWeek.value,
        text: text.value,
        isSafe: false,
      });
    } else {
      saveRecord({
        beginOfWeek: beginOfWeek.value,
        endOfWeek: endOfWeek.value,
        text: text.value,
        isSafe: false,
      });
    }
  };

  const createRecord = ({ beginOfWeek, endOfWeek, text, isSafe }) => {
    api
      .post(`/records/create/`, {
        beginOfWeek: beginOfWeek,
        identnumber: user.identnumber,
        apprenticeshipyear: user.apprenticeshipyear,
        endOfWeek: endOfWeek,
        text: text,
        status: isSafe ? 1 : 0,
        statusText: '',
      })
      .then((response) => {
        if (response.status == 201) {
          if (isSafe) {
            setStatusMessage({
              type: 'success',
              message: 'Neues Berichtsheft wurde erfolgreich erstellt!',
            });
            return;
          } else {
            setStatusMessage({
              type: 'success',
              message: 'Neues Berichtsheft wurde erfolgreich abgeschickt!',
            });
            return;
          }
        } else {
          setStatusMessage({
            type: 'error',
            message:
              'Es ist ein Problem beim Erstellen des Berichtsheftes aufgetreten!',
          });
        }
      })
      .catch((error) => {
        setStatusMessage({
          type: 'error',
          message:
            'Es ist ein Problem beim Erstellen des Berichtsheftes aufgetreten!',
        });
      });
  };

  const saveRecord = ({ beginOfWeek, endOfWeek, text, isSafe }) => {
    api
      .post(`/records/save/${id}`, {
        beginOfWeek: beginOfWeek,
        identnumber: user.identnumber,
        endOfWeek: endOfWeek,
        text: text,
        isSafe,
      })
      .then((response) => {
        if (response.status == 200) {
          if (response.data.message == 'Record saved.') {
            setStatusMessage({
              type: 'success',
              message: 'Berichtsheft wurde erfolgreich gespeichert!',
            });
            return;
          } else {
            setStatusMessage({
              type: 'success',
              message: 'Berichtsheft wurde erfolgreich abgeschickt!',
            });
            return;
          }
        } else {
          setStatusMessage({
            type: 'error',
            message:
              'Es ist ein Problem beim Abschicken des Berichtsheftes aufgetreten!',
          });
        }
      })
      .catch((error) => {
        setStatusMessage({
          type: 'error',
          message:
            'Es ist ein Problem beim Abschicken des Berichtsheftes aufgetreten!',
        });
      });
  };

  const formatDateForDatePicker = (date) => {
    const d = new Date(date);
    return (
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2)
    );
  };

  const goOn = () => {
    history.push('/');
  };

  return (
    <div className={styles.recordView_container}>
      <GoBackBar />
      {loading && <LoadingSpinner />}
      {record && !loading && !statusMessage && (
        <Paper elevation={3} className={styles.recordView_container_inner}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={2} className={styles.recordView_label}>
                Nummer:
              </Grid>
              <Grid item xs={10}>
                <TextField
                  value={record.number || recordNumber}
                  name='number'
                  variant='outlined'
                  disabled
                />
              </Grid>
              <Grid item xs={2} className={styles.recordView_label}>
                Wochenanfang:
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={formatDateForDatePicker(record.beginOfWeek)}
                  type='date'
                  name='beginOfWeek'
                  inputRef={beginOfWeek_ref}
                  variant='outlined'
                  disabled={!editable && !addable}
                />
              </Grid>
              <Grid item xs={2} className={styles.recordView_label}>
                Wochenende:
              </Grid>
              <Grid item xs={4}>
                <TextField
                  defaultValue={formatDateForDatePicker(record.endOfWeek)}
                  type='date'
                  inputRef={endOfWeek_ref}
                  name='endOfWeek'
                  variant='outlined'
                  disabled={!editable && !addable}
                />
              </Grid>
              <Grid item xs={2} className={styles.recordView_label}>
                Ausbildungsjahr:
              </Grid>
              <Grid item xs={4}>
                <span className={styles.recordView_badge}>
                  {record.apprenticeshipyear || user.apprenticeshipyear}
                </span>
              </Grid>
              <Grid item xs={2} className={styles.recordView_label}>
                Status:
              </Grid>
              <Grid item xs={4} className={styles.recordView_label}>
                <Chip
                  label={getStatusText(record.status || -1)}
                  {...getStatusColorProp(record.status || -1)}
                  size='medium'
                />
              </Grid>

              {record.status == 3 && record.statusText != '' && (
                <Fragment>
                  <Grid item xs={12} className={styles.recordView_label}>
                    Ablehnungsgrund des Ausbilders:
                  </Grid>
                  <Grid item xs={12}>
                    <div className={styles.error_container}>
                      {record.statusText}
                    </div>
                  </Grid>
                </Fragment>
              )}

              <Grid item xs={12} className={styles.recordView_label}>
                Text:
              </Grid>
              <Grid item xs={12}>
                <TextField
                  defaultValue={record.text}
                  multiline
                  rows={4}
                  name='text'
                  inputRef={text_ref}
                  variant='outlined'
                  disabled={!editable && !addable}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                {!editable && !addable && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={pdfClick}
                  >
                    <PictureAsPdf style={{ marginRight: '10px' }} /> als PDF
                    ansehen
                  </Button>
                )}
                {!editable &&
                  !addable &&
                  (record.status == 3 || record.status == 1) && (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={switchToEditClick}
                      style={{ marginLeft: '10px' }}
                    >
                      <Edit style={{ marginRight: '10px' }} />{' '}
                      {record.status == 3 && 'erneut '}
                      bearbeiten
                    </Button>
                  )}
                {(editable || addable) && (
                  <div>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={saveRecordClick}
                    >
                      <Save style={{ marginRight: '10px' }} /> speichern
                    </Button>
                    <span className={styles.buttonLabel}>
                      oder direkt {record.status == 3 && 'erneut'}
                    </span>
                    <Button variant='contained' color='primary' type='submit'>
                      <Send style={{ marginRight: '10px' }} /> abschicken
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
      {statusMessage && !loading && (
        <div
          className={[
            styles.recordView_container_inner,
            statusMessage.type == 'success'
              ? styles.success_container
              : styles.error_container,
          ].join(' ')}
        >
          {statusMessage.message}
          <Button
            variant='contained'
            color='primary'
            onClick={goOn}
            style={{ marginLeft: '10px' }}
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordView;
