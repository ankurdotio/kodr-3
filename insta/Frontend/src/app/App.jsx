import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { Provider } from 'react-redux'
import { store } from './app.store'


function App() {

  return (

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  )
}

export default App
