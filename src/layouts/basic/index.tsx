import React, { Fragment } from 'react'
import { renderRoutes, matchRoutes, MatchedRoute } from 'react-router-config'
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { compose } from 'recompose'
import { useTitle } from 'ahooks'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import withNProgress from '@/hoc/withNProgress'
import SideBar from './SideBar'
import HeaderBar from './HeaderBar'
import styles from './index.module.less'
import { useRootStore } from '@/store'
import { getTitle } from '@/utils'

type IProps = MatchedRoute<{}>

const BasicLayout: React.FC<IProps> = (props) => {
  const { route } = props
  const history = useHistory()
  const location = useLocation()
  const { userStore, appStore } = useRootStore()
  const { currentUser, menus, breads } = userStore
  const { collapsed, toggleCollapsed } = appStore
  const branches = matchRoutes(route.routes || [], location.pathname)
  const branch = branches[branches.length - 1] || {}
  const title = branch.route ? getTitle(branch.route.title) : ''
  useTitle(title)
  const sidebarProps = {
    collapsed,
    menus,
    location
  }
  const headerProps = {
    collapsed,
    toggleCollapsed,
    user: currentUser,
    history,
    breads
  }
  return (
    <div className={`${styles.basicLayout} ${collapsed ? styles.collapsed : ''}`}>
      <SideBar {...sidebarProps} />
      <section className={styles.appMain}>
        <div className={styles.headerPadding} />
        <HeaderBar {...headerProps} />
        <TransitionGroup component={Fragment}>
          <CSSTransition
            key={location.key}
            timeout={{ enter: 300, exit: 0 }}
            classNames="fade"
            unmountOnExit
          >
            {renderRoutes(route.routes, {}, { location })}
          </CSSTransition>
        </TransitionGroup>
      </section>
    </div>
  )
}

export default compose(
  withNProgress,
  observer
)(BasicLayout)
