import humanizeDuration from 'humanize-duration'

const duration = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y () { return 'y' },
      mo () { return 'mo' },
      w () { return 'w' },
      d () { return 'd' },
      h () { return 'h' },
      m () { return 'm' },
      s () { return 's' },
      ms () { return 'ms' }
    }
  }
})

module.exports = (d) => duration(d, { units: ['y', 'mo', 'w', 'd', 'h', 'm', 's', 'ms'] })
