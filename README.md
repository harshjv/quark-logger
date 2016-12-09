# Quark Logger (for electron)

> WIP

## Installation

    npm install --save quark-logger


## Usage

To log something, in ***main*** process file or in ***rendering*** process;

    const quark = require('quark-logger')('example:main')

    // ..
    // ...
    // ..

    quark('log something')


And, somewhere in the main process file;

    const Quark = require('quark-logger')

    // ..
    // ...
    // ..

    Quark.quarkWindow.show() // to bring up the Quark Logging Window


## License

MIT
