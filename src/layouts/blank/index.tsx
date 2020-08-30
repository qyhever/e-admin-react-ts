import React from 'react'
import { renderRoutes, RouteConfig } from 'react-router-config'

const BlankLayout = ({ route }: RouteConfig) => (
  <>
    {renderRoutes(route.routes)}
  </>
)

export default BlankLayout
