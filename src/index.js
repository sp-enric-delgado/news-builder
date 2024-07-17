import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom';
import './styles/index.css';
import App from './App';
import {createTheme, ThemeProvider} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    palette: {
        primary: {
            main: '#433bff',
            light: '#dddbff',
            dark: '#2f27ce',
            contrastText: '#eae9fc',
        },
        secondary: {
            main: '#0600c2',
            light: '#3a31d8',
            dark: '#020024',
            contrastText: '#eae9fc',
        }
    },
    typography: {
        h1: {
            fontSize: '3rem',
            fontWeight: 600
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 600
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600
        }
    }
})

root.render(
  // <React.StrictMode>
    <Router>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
    </Router>
  // </React.StrictMode>
);