import React, { PureComponent } from 'react'
import { renderRoutes, RouteConfig } from 'react-router-config'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { UserStoreType } from '@/store/user/reducer'
import { toggleCollapsed, ToggleCollapsedType } from '@/store/app/action'
import SideBar from './SideBar'
import HeaderBar from './HeaderBar'
import styles from './index.module.less'
import { AppState } from '@/store'

type IProps = RouteConfig & RouteComponentProps & {
  user: UserStoreType
  collapsed: boolean
  toggleCollapsed: ToggleCollapsedType
}

type IState = Readonly<{
  collapsed: boolean
  pathname: string
}>

class BasicLayout extends PureComponent<IProps> {
  state: IState = {
    collapsed: false,
    pathname: ''
  }
  handleToggle = () => {
    this.props.toggleCollapsed()
    // this.setState({
    //   collapsed: !this.state.collapsed
    // })
  }
  render() {
    // const { collapsed } = this.state
    const { route, location, history, user, collapsed } = this.props
    const { currentUser, menus } = user
    const sidebarProps = {
      collapsed,
      menus,
      location
    }
    const headerProps = {
      collapsed,
      onToggle: this.handleToggle,
      user: currentUser,
      history
    }
    return (
      <div className={styles.basicLayout}>
        <SideBar {...sidebarProps} />
        <section className={`${styles.appMain} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.headerPadding} />
          <HeaderBar {...headerProps} />
          {renderRoutes(route.routes)}
        </section>
      </div>
    )
  }
}
const mapStateToProps = ({ app, user }: AppState) => ({
  collapsed: app.collapsed,
  user
})
const mapDispatchToProps = {
  toggleCollapsed
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicLayout)
