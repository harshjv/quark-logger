import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.jsx'
import Actions from './actions/Actions'

import '../sass/style.scss'

Actions.init()
ReactDOM.render(
  <App />,
  document.getElementById('main')
)
