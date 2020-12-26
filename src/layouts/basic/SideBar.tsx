import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Location } from 'history'
import { Layout, Menu, Switch } from 'antd'
import { BulbOutlined, SmileOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import logoUrl from '@/assets/images/logo.png'
import IconFont from '@/components/iconfont'
import { Scrollbars } from 'react-custom-scrollbars'
import { MenuItemType } from '@/store/user'
import { getSideBarTheme, setSideBarTheme } from '@/utils/local'
const { Sider } = Layout
const { Item, SubMenu } = Menu
// const MyMenu = Menu as any
// https://github.com/ant-design/ant-design/issues/17551

// 获取所有 menu（非父菜单，能选中高亮的） 的 key（即 path）
const getTotalSelectedKeys = (routes: MenuItemType[]) => {
  // 先获取所有 menu（扁平化过后的）
  function getTotalSelectedMenus(routes: MenuItemType[]) {
    let result: MenuItemType[] = []
    routes.forEach(item => {
      if (Array.isArray(item.routes)) {
        result = result.concat(getTotalSelectedMenus(item.routes))
      } else {
        result.push(item)
      }
    })
    // 过滤掉 父菜单
    return result.filter(item => !item.hidden && !item.routes)
  }
  const totalSelectedMenus = getTotalSelectedMenus(routes)
  return totalSelectedMenus.map(item => item.path)
}
// 渲染图标
const RenderIcon: React.FC<{
  name: string
}> = props => {
  const { name } = props
  if (!name) {
    return null
  }
  if (name.indexOf('icon-') === 0) {
    return <IconFont type={name} />
  }
  const Icon = require('@ant-design/icons')[name]
  if (Icon) {
    return <Icon />
  }
  return <SmileOutlined/>
}
// 生成菜单树
const generateMenus = (menus: MenuItemType[]) => {
  return menus.map(item => {
    if (Array.isArray(item.routes)) {
      const title = (
        <span>
          <RenderIcon name={item.icon}/>
          <span>{item.title}</span>
        </span>
      )
      return !item.hidden && (
        <SubMenu key={item.path} title={title}>
          {generateMenus(item.routes)}
        </SubMenu>
      )
    }
    return !item.hidden && (
      <Item key={item.path}>
        <Link to={item.path}>
          <RenderIcon name={item.icon}/>
          <span>{item.title}</span>
        </Link>
      </Item>
    )
  })
}
type IProps = {
  collapsed: boolean
  menus: MenuItemType[]
  location: Location
}
type IState = {
  openKeys: string[]
  collapsed: boolean
  lastOpenKeys: string[],
  theme: 'light' | 'dark'
}
class SideBar extends PureComponent<IProps, IState> {
  private rootMenuKeys: string[]
  private totalSelectedKeys: string[]
  private selectedKey: string
  constructor(props: IProps) {
    super(props)
    // 父菜单（即有展开箭头的）
    this.rootMenuKeys = props.menus.filter(item => Array.isArray(item.routes)).map(item => item.path)
    // 所有子菜单
    this.totalSelectedKeys = getTotalSelectedKeys(props.menus)
    // 当前高亮菜单，当前 pathname 以 key 开头，则 key 需要选中高亮
    this.selectedKey = this.totalSelectedKeys.find(key => props.location.pathname.startsWith(key)) || ''
    // 当前展开菜单，当前 pathname 以 key 开头，则 key 需要展开
    const openKey = this.rootMenuKeys.find(key => props.location.pathname.startsWith(key)) || ''
    this.state = {
      openKeys: [openKey],
      collapsed: false,
      lastOpenKeys: [],
      theme: getSideBarTheme() === 'light' ? 'light' : 'dark'
    }
  }
  // hack 菜单折叠后，子菜单不消失的 问题
  // 原因：菜单折叠后，openKeys 并没有清空
  // https://github.com/ant-design/ant-design/issues/14536
  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.collapsed !== state.collapsed) {
      if (props.collapsed) {
        state.lastOpenKeys = state.openKeys
        return {
          collapsed: props.collapsed,
          openKeys: [] // 收起清空
        }
      }
      return {
        collapsed: props.collapsed,
        openKeys: state.lastOpenKeys // 展开恢复
      }
    }
    return null
  }
  // 只展开当前父级菜单
  onOpenChange = (openKeys: string[]) => {
    const currentOpenKey = openKeys.find(key => !this.state.openKeys.includes(key)) || ''
    if (!this.rootMenuKeys.includes(currentOpenKey)) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: currentOpenKey ? [currentOpenKey] : []
      })
    }
  }
  onSwitchChange = (val: boolean) => {
    const theme = val ? 'dark' : 'light'
    setSideBarTheme(theme)
    this.setState({
      theme
    })
  }
  render() {
    const { theme } = this.state
    const { collapsed, menus } = this.props
    const toggleThemeStyle = { display: collapsed ? 'none' : 'flex' }
    return (
      <Sider
        width={210}
        className={`${styles.sideBar} ${styles[theme]}`}
        collapsible
        collapsed={collapsed}
        collapsedWidth={60}
        trigger={null}
        theme={theme}>
        <Scrollbars style={{height: '100%'}} autoHide>
          <Link className={styles.logoContainer} to="/">
            <img alt="logo" src={logoUrl} className={styles.image} />
            {!collapsed && <h1 className={styles.title}>后台管理系统</h1>}
          </Link>
          <Menu
            mode="inline"
            theme={theme}
            defaultSelectedKeys={[this.selectedKey]}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
          >
            {generateMenus(menus)}
          </Menu>
        </Scrollbars>
        <div className={styles.toggleTheme} style={toggleThemeStyle}>
          <div className={styles.toggleThemeLeft}>
            <BulbOutlined />
            <span className={styles.toggleThemeText}>切换主题</span>
          </div>
          <Switch checkedChildren="黑" unCheckedChildren="白" checked={theme === 'dark'} onChange={this.onSwitchChange}></Switch>
        </div>
      </Sider>
    )
  }
}

export default SideBar
