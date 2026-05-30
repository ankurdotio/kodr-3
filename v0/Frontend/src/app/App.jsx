import React from 'react';
import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { Provider } from 'react-redux'
import store from './app.store'
import { AuthProvider } from '../features/auth/AuthContext'
import { ThemeProvider } from '../features/theme/ThemeContext'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
