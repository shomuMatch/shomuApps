import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7383A2',
      main: '#445577',
      dark: '#002f6c',
      contrastText: '#FFF',
    },
    secondary: {
      light: '#FF6428',
      main: '#FF9678',
      dark: '#c41c00',
      contrastText: '#FFF',
    },
  },
});
