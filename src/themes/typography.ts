import { createTheme } from "@mui/material";

const theme = createTheme();

const typography = {
  h1: {
    fontSize: '32px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '40px',
    },
  },
  h2: {
    fontSize: '28px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '36px',
    },
  },
  h3: {
    fontSize: '24px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '32px',
    },
  },
  h4: {
    fontSize: '20px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '28px',
    },
  },
  h5: {
    fontSize: '16px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '24px',
    },
  },
  h6: {
    fontSize: '14px',
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      fontSize: '20px',
    },
  },
  body1: {
    fontSize: '14px',
    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
    },
  },
  body2: {
    fontSize: '12px',
    fontColor: '#9796A1',
    [theme.breakpoints.up('md')]: {
      fontSize: '14px',
    },
  },
  subtitle1: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4B4B4B',
    [theme.breakpoints.up('md')]: {
      fontSize: '28px',
    },
  },
  subtitle2: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4B4B4B',
    [theme.breakpoints.up('md')]: {
      fontSize: '24px',
    },
  },
};
export default typography;
