import React from 'react'
import { renderRoutes, MatchedRoute } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import SideBar from './SideBar'
import HeaderBar from './HeaderBar'
import styles from './index.module.less'
import { useRootStore } from '@/store'

type IProps = MatchedRoute<{}>

const BasicLayout: React.FC<IProps> = (props) => {
  const { route } = props
  const history = useHistory()
  const location = useLocation()
  const { userStore, appStore } = useRootStore()
  const { currentUser, menus } = userStore
  const { collapsed, toggleCollapsed } = appStore
  const sidebarProps = {
    collapsed,
    menus,
    location
  }
  const headerProps = {
    collapsed,
    toggleCollapsed,
    user: currentUser,
    history
  }
  return (
    <div className={`${styles.basicLayout} ${collapsed ? styles.collapsed : ''}`}>
      <SideBar {...sidebarProps} />
      <section className={styles.appMain}>
        <div className={styles.headerPadding} />
        <HeaderBar {...headerProps} />
        {renderRoutes(route.routes)}
      </section>
    </div>
  )
}

export default observer(BasicLayout)
