const quark = require('../dist/quark.bundle.js')('example:node')

setInterval(() => quark('Hello from Node.js app'), 1000)
