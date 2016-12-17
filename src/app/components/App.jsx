import React from 'react'
import {Table, Column, Cell} from 'fixed-data-table'

import duration from '../utils/duration'
import LogStore from '../stores/LogStore'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      logs: [],
      query: {
        pid: '',
        tag: '',
        data: ''
      },
      total_log_size: 0
    }

    this._onFilterChange = this._onFilterChange.bind(this)
    this._onLogStoreChange = this._onLogStoreChange.bind(this)
    this._updateWindowTitle = this._updateWindowTitle.bind(this)
  }

  _onFilterChange (key) {
    return (e) => {
      const query = Object.assign(this.state.query, {
        [key]: e.target.value
      })

      this.setState({
        query: query,
        logs: LogStore.getLogs(query)
      })
    }
  }

  componentDidMount () {
    LogStore.addChangeListener(this._onLogStoreChange)
  }

  componentWillUnmount () {
    LogStore.removeChangeListener(this._onLogStoreChange)
  }

  _onLogStoreChange () {
    const query = this.state.query

    this.setState({
      logs: LogStore.getLogs(query),
      total_log_size: LogStore.getTotalLogSize()
    })
  }

  _updateWindowTitle () {
    let title = 'Quark'

    if (this.state.logs.length === this.state.total_log_size) {
      window.document.title = `${title} (${this.state.total_log_size})`
    } else {
      window.document.title = `${title} (${this.state.logs.length}/${this.state.total_log_size})`
    }
  }

  render () {
    console.log('Rendering app')

    this._updateWindowTitle()

    return (
      <Table
        rowHeight={50}
        rowsCount={this.state.logs.length}
        width={window.innerWidth}
        height={window.innerHeight}
        headerHeight={50}
        allowCellsRecycling>
        <Column
          header={
            <Cell>
              PID <input type='text' onChange={this._onFilterChange('pid')} placeholder='Filter (number)' />
            </Cell>
          }
          cell={({rowIndex, ...props}) => (
            <Cell {...props} className='log-data'>
              {this.state.logs[rowIndex].pid}
            </Cell>
          )}
          width={100}
          flexGrow={1}
        />
        <Column
          header={
            <Cell>
              Time
            </Cell>
          }
          cell={({rowIndex, ...props}) => (
            <Cell {...props} className='log-data'>
              {this.state.logs[rowIndex].time}
              (+{duration(this.state.logs[rowIndex].diff)})
            </Cell>
          )}
          width={100}
          flexGrow={1}
        />
        <Column
          header={
            <Cell>
              Tag <input type='text' onChange={this._onFilterChange('tag')} placeholder='Filter (RegEx)' />
            </Cell>
          }
          cell={({rowIndex, ...props}) => (
            <Cell {...props} className='log-data'>
              {this.state.logs[rowIndex].tag}
            </Cell>
          )}
          width={100}
          flexGrow={1.25}
        />
        <Column
          header={
            <Cell>
              Data <input type='text' onChange={this._onFilterChange('data')} placeholder='Filter (RegEx)' />
            </Cell>
          }
          cell={({rowIndex, ...props}) => (
            <Cell {...props} className='log-data'>
              {this.state.logs[rowIndex].data}
            </Cell>
          )}
          flexGrow={2}
          width={100}
        />
      </Table>
    )
  }
}
