import getConfig from 'next/config';
import 'fontsource-roboto';
import '../styles/globals.scss';

import ProtectedRoute from '../components/ProtectedRoute';
const { serverRuntimeConfig: config } = getConfig();

import { AuthProvider } from '../components/AuthProvider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default MyApp;
