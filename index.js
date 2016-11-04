var Quark = require('./dist/quark.bundle.js')

const q1 = Quark('ok:12')
const q2 = Quark('exodus:test')
const q3 = Quark('exodus:error')

let c = 1

class X {
  ok () {

  }
}

let o = setInterval(() => {
  if (Math.random() > 0.5) {
    q1('Hello ' + c, 'World', 'Great', [ 1, 2, 3 ])
  } else {
    q2('Hello ' + c, 'North', 'Okay', { 'asd': 'asda' }, '123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag123sag')
    q3(new Error('LOL'))
    q3(new X())
  }
  c++
  if (c > 200) clearInterval(o)
}, 500)
