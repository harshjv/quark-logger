import BaseStore from './BaseStore'
import AppDispatcher from '../dispatcher/Dispatcher'
import ActionTypes from '../constants/ActionTypes'

const sanitizeQuery = (str) => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')

class LogStoreClass extends BaseStore {
  constructor () {
    super()
    this.logs = []
  }

  addNewLog (log) {
    let data = JSON.stringify(log.data)

    if (log.data.length === 1) {
      log.data = data.substring(1, data.length - 1)
    } else {
      log.data = data
    }

    this.logs.push(log)
  }

  getTotalLogSize () {
    return this.logs.length
  }

  getLogs (query) {
    if (query.pid === '' && query.tag === '' && query.data === '') {
      return this.logs
    }

    const pidPattern = query.pid !== '' ? query.pid : true
    const tagPattern = query.tag !== '' ? new RegExp(sanitizeQuery(query.tag), 'i') : true
    const dataPattern = query.data !== '' ? new RegExp(sanitizeQuery(query.data), 'i') : true
    const filteredLogs = []

    for (let log of this.logs) {
      if ((pidPattern === true || pidPattern === `${log.pid}`) &&
          (tagPattern === true || tagPattern.test(log.tag)) &&
          (dataPattern === true || dataPattern.test(log.data))) {
        filteredLogs.push(log)
      }
    }

    return filteredLogs
  }
}

const LogStore = new LogStoreClass()

const register = {
  [ ActionTypes.NEW_LOG ]: (data) => {
    LogStore.addNewLog(data)
    LogStore.emitChange()
  }
}

AppDispatcher.register((payload) => {
  const type = payload.type
  const data = payload.data

  ;(register[type] || function () {})(data)
})

export default LogStore
