import React          from 'react';
import ReactDOM       from 'react-dom';
import { AppProvider } from './context/AppContext';
import { AppRouter }  from './router/AppRouter';
import "./styles/main.css";

ReactDOM.render(
  <React.StrictMode>
      <AppProvider>
          <AppRouter/>
      </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
