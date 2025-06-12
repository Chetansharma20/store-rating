import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import MainStore, { Persistor } from './reduxwork/MainStore.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    

    <Provider store={MainStore}>
        <PersistGate persistor={Persistor}>
        <BrowserRouter>
      <App/>
       </BrowserRouter>
       </PersistGate>
    </Provider>

  </StrictMode>,
)
