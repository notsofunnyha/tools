import _ from 'lodash'

function component() {
  const element = document.createElement('div')

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())

import React, { useState } from 'react'
import { render } from 'react-dom'
import 'antd/dist/antd.css'

const App = () => <>hello react</>

render(<App />, document.getElementById('root'))
