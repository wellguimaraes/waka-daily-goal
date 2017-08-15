import * as React from 'react'
import axios from 'axios'
import formatDate from 'date-fns/format'
import { startOfToday, addMinutes, addHours, differenceInMinutes } from 'date-fns'
import { MaskedField, ConfigForm, TimeInfo, Field, AppRoot, FieldContainer, TimeFieldContainer } from './App.styles'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      apiKey: localStorage.getItem('apiKey'),
      timeGoal: localStorage.getItem('timeGoal') || '07:00',
      workUntil: localStorage.getItem('workUntil') || '21:00',
      filter: localStorage.getItem('filter'),
      totalMinutes: 0
    }

    this.updateTotalMinutes = this.updateTotalMinutes.bind(this)
  }

  componentDidMount() {
    this.updateTotalMinutes()

    setInterval(() => this.updateTotalMinutes(), 60000)
  }

  async updateTotalMinutes() {
    const apiKey = this.state.apiKey

    if (!apiKey) return

    const { data: { data } } = await axios.get('https://wakatime.com/api/v1/users/current/durations', {
      params: {
        api_key: apiKey,
        date: formatDate(new Date(), 'MM/DD/YYYY')
      }
    })

    const filters = (this.state.filter || '')
      .split(/\s+/)
      .filter(it => it)
      .map(it => ({
        negative: it.startsWith('-'),
        pattern: it.replace(/^-/, '')
      }))
      .reduce((prev, curr) => {
        prev[ curr.negative ? 'negative' : 'positive' ].push(curr.pattern)
        return prev
      }, { negative: [], positive: [] })

    const totalMinutes = data
      .filter(it =>
        filters.negative.every(f => !it.project.includes(f)) &&
        (
          !filters.positive.length ||
          filters.positive.some(f => it.project.includes(f))
        )
      )
      .reduce((sum, it) => sum + it.duration, 0) / 60

    this.setState({ totalMinutes })
  }

  get risk() {
    const { timeGoal, workUntil, totalMinutes } = this.state

    if (!timeGoal || !workUntil || !totalMinutes)
      return

    const [ untilHour, untilMinutes ] = workUntil.split(':').map(it => parseInt(it, 10))
    const [ goalHours, goalMinutes ] = timeGoal.split(':').map(it => parseInt(it, 10))

    const totalGoalMinutes = goalHours * 60 + goalMinutes

    const startRef = startOfToday()
    const endRef = addMinutes(addHours(startRef, untilHour), untilMinutes)
    const availableTime = differenceInMinutes(endRef, new Date())
    const remainingTimeToWork = Math.floor(totalGoalMinutes - totalMinutes)

    return remainingTimeToWork / availableTime
  }

  field(name) {
    return {
      value: this.state[ name ] || '',
      onChange: e => {
        const newValue = e.target.value
        window.localStorage.setItem(name, newValue)
        this.setState({ [name]: newValue }, () => this.updateTotalMinutes())
      }
    }
  }

  get formattedTotalMinutes() {
    const currentTime = addMinutes(startOfToday(), this.state.totalMinutes)
    return formatDate(currentTime, 'HH:mm')
  }

  render() {

    return (
      <AppRoot risk={ this.risk }>
        <ConfigForm>
          <FieldContainer>
            <label>API Key</label>
            <Field type="password" placeholder="API Key" { ...this.field('apiKey') }/>
          </FieldContainer>
          <TimeFieldContainer>
            <label>Time Goal</label>
            <MaskedField mask={ [ /\d/, /\d/, ':', /\d/, /\d/ ] } type="text"
                         placeholder="hh:mm" { ...this.field('timeGoal') } />
          </TimeFieldContainer>
          <TimeFieldContainer>
            <label>Stop at</label>
            <MaskedField mask={ [ /\d/, /\d/, ':', /\d/, /\d/ ] } type="text"
                         placeholder="HH:mm" { ...this.field('workUntil') }/>
          </TimeFieldContainer>
          <FieldContainer>
            <label>Filter</label>
            <Field type="text"  { ...this.field('filter') }/>
          </FieldContainer>
        </ConfigForm>
        <TimeInfo>
          <div>Worked so far</div>
          <h1>{ this.formattedTotalMinutes }</h1>
        </TimeInfo>
      </AppRoot>
    )
  }
}

export default App