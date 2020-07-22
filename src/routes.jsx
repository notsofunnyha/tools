import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './views/home'
function About1() {
  return <h2>About Page 1</h2>
}

function About2() {
  return <h2>About Page 2</h2>
}

function About3() {
  return <h2>About Page 3</h2>
}

function Routes() {
  return (
    <Switch>
      {/* exact 精确匹配 https://reactrouter.com/web/api/Route/exact-bool */}
      <Route path="/" exact={true} component={Home} />
      <Route path="/about1" exact={true} component={About1} />
      <Route path="/about2" exact={true} component={About2} />
      <Route path="/about3" exact={true} component={About3} />
    </Switch>
  )
}

export default Routes
