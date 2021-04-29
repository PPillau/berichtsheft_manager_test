import styles from './PDFView.module.scss';
import { useParams, useLocation } from 'react-router-dom';

import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoadingSpinner from '../LoadingSpinner';

import api from '../api';

import { useAuth } from '../AuthProvider';

const PDFView = ({}) => {
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const { search } = useLocation();
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!id) {
      history.push('/');
    }

    api
      .post(
        `/pdf/${id}`,
        { identnumber: user.identnumber },
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/pdf',
          },
        }
      )
      .then((pdfResponse) => {
        if (pdfResponse.status == 200) {
          const url = window.URL.createObjectURL(
            new Blob([pdfResponse.data], { type: 'application/pdf' })
          );
          if (search) {
            const query = new URLSearchParams(search);
            if (query.get('return') && query.get('return')) {
              history.push(`/view/${id}`);
            } else {
              history.push('/');
            }
          } else {
            history.push('/');
          }
          window.open(url, '_self');
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.PDFView_container}>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default PDFView;
