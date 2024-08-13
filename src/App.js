import './App.css';

import DesktopCalculator from './DesktopCalculator'
import MobileCalculator from './MobileCalculator'

import {
  useReducer,
} from 'react'

import {
  Context,
  initialState,
} from './store/Context'

import {
  reducer,
} from './store/reducer'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}
  
  function isDesktop() {
    return 850 < window.innerWidth
  }

  return (
    <Context.Provider value={value}>
      {
        isDesktop() ? <DesktopCalculator /> : <MobileCalculator />
      }
    </Context.Provider>
  )
}

export default App
