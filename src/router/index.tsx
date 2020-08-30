import React from 'react'
import { Switch, Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { history } from '@/utils/history'
import routes from './routes'

const RouterConfig: React.FC = () => (
  <Router history={history}>
    <Switch>
      {renderRoutes(routes)}
    </Switch>
  </Router>
)

export default RouterConfig
