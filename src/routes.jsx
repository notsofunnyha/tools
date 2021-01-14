import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import ErrorBoundary from './component/ErrorBoundary'
import { route, defaultRoute } from './menu'

export default function Routes() {
  return (
    <Switch>
      {/* exact 精确匹配 https://reactrouter.com/web/api/Route/exact-bool */}
      {route.map((m, index) => {
        const M = require('./view' + m.path).default
        const component = () => (
          <ErrorBoundary>
            <M />
          </ErrorBoundary>
        )
        return <Route key={index} path={m.path} exact={true} component={component} />
      })}
      <Redirect from="/" to={defaultRoute} />
    </Switch>
  )
}
