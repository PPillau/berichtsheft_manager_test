import styles from './list.module.scss';
import { Tooltip, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { DataGrid } from '@material-ui/data-grid';
import {
  PictureAsPdf,
  CancelOutlined,
  CheckCircleOutlineOutlined,
  HelpOutlineOutlined,
  Edit,
  ErrorOutlineOutlined,
  Visibility,
  Add,
} from '@material-ui/icons';

import { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';

import api from '../api';
import { useAuth } from '../AuthProvider';

const list = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const history = useHistory();

  const columns = [
    { field: 'id', hide: true },
    {
      field: 'number',
      headerName: 'Nr.',
      type: 'number',
      align: 'center',
      headerAlign: 'center',
      disableClickEventBubbling: true,
    },
    {
      field: 'beginOfWeek',
      headerName: 'Wochenanfang',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      disableClickEventBubbling: true,
    },
    {
      field: 'endOfWeek',
      headerName: 'Wochenende',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      disableClickEventBubbling: true,
    },
    {
      field: 'apprenticeshipyear',
      headerName: 'Ausbildungsjahr',
      type: 'number',
      flex: 0.3,
      align: 'center',
      headerAlign: 'center',
      disableClickEventBubbling: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (params.value == 0) {
          return (
            <div className={styles.actions_container}>
              <Tooltip title='Ausstehend' placement='top'>
                <HelpOutlineOutlined color='primary' />
              </Tooltip>
            </div>
          );
        } else if (params.value == 1) {
          return (
            <div className={styles.actions_container}>
              <Tooltip title='Noch nicht abgeschickt' placement='top'>
                <ErrorOutlineOutlined />
              </Tooltip>
            </div>
          );
        } else if (params.value == 2) {
          return (
            <div className={styles.actions_container}>
              <Tooltip title='Genehmigt' placement='top'>
                <CheckCircleOutlineOutlined style={{ color: 'green' }} />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <div className={styles.actions_container}>
              <Tooltip title='Abgelehnt' placement='top'>
                <CancelOutlined color='secondary' />
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      align: 'center',
      headerAlign: 'center',
      width: 110,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => (
        <div className={[styles.actions_container, styles.action].join(' ')}>
          {(params.getValue('status') == 1 ||
            params.getValue('status') == 3) && (
            <Link to={'/edit/' + params.getValue('id')}>
              <Tooltip
                title={
                  'Berichtsheft ' +
                  (params.getValue('status') == 3 ? 'verbessern' : 'bearbeiten')
                }
                placement='top'
              >
                <Edit></Edit>
              </Tooltip>
            </Link>
          )}

          <Link to={'/pdf/' + params.getValue('id')}>
            <Tooltip title='Berichtsheft als PDF ansehen' placement='top'>
              <PictureAsPdf />
            </Tooltip>
          </Link>

          <Link to={'/view/' + params.getValue('id')}>
            <Tooltip title='Berichtsheft ansehen' placement='top'>
              <Visibility />
            </Tooltip>
          </Link>
        </div>
      ),
    },
  ];

  const transformRecords = (records) => {
    const dateOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return records.map((x) => ({
      id: x.id,
      number: x.number,
      beginOfWeek: new Date(x.beginOfWeek).toLocaleDateString(
        'de-DE',
        dateOptions
      ),
      endOfWeek: new Date(x.endOfWeek).toLocaleDateString('de-DE', dateOptions),
      apprenticeshipyear: x.apprenticeshipyear,
      status: x.status,
    }));
  };

  const goToAddComponent = () => {
    history.push('/add');
  };

  useEffect(() => {
    api.get(`/records/${user.identnumber}`).then((rowsResponse) => {
      if (rowsResponse.status == 200) {
        setRows(transformRecords(rowsResponse.data.records));
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className={styles.list_container}>
      <div className={styles.add_container}>
        <Tooltip title='Neues Berichtsheft hinzufügen' placement='top'>
          <Fab
            color='primary'
            aria-label='hinzufügen'
            onClick={goToAddComponent}
          >
            <Add />
          </Fab>
        </Tooltip>
      </div>
      <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight={true} />
    </div>
  );
};

export default list;
