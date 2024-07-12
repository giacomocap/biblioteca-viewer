// import '../styles/globals.css'
import { AppPropsWithLayout } from '../types/next_extensions'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <ThemeProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}

export default MyApp
