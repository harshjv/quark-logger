import { ipcRenderer } from 'electron'
import ActionTypes from '../constants/ActionTypes'
import AppDispatcher from '../dispatcher/Dispatcher'

export default {
  init () {
    ipcRenderer.on('log', (event, log) => {
      AppDispatcher.dispatch({
        type: ActionTypes.NEW_LOG,
        data: log
      })
    })
  }
}
