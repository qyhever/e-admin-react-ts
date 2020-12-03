import React from 'react'
import { Dropdown, Menu, Row, Avatar } from 'antd'
import { History } from 'history'
import { MenuInfo } from 'rc-menu/lib/interface'
// import { ClickParam } from 'antd/lib/menu'
import styles from './index.module.less'
import { CaretDownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'
import avatarUrl from '@/assets/images/user.png'
import { removeUserData } from '@/utils/local'
import { CurrentUserType } from '@/store/user'
import { useFullscreen } from 'ahooks'
import FullScreenIcon from '@/components/fullscreen'

type IProps = {
  collapsed: boolean
  toggleCollapsed: () => void
  user: CurrentUserType
  history: History
}
const HeaderBar: React.FC<IProps> = props => {
  const { collapsed, toggleCollapsed, user } = props
  const [, { toggleFull }] = useFullscreen(() => document.getElementById('root'))
  // MenuInfo https://github.com/ant-design/ant-design/issues/25467
  const handleMenuClick = ({ key }: MenuInfo) => {
    if (key === 'logout') {
      removeUserData()
      window.location.reload()
    }
  }
  const onSidebarToggle = () => {
    toggleCollapsed()
  }
  const onToggleFullscreen = () => {
    toggleFull()
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">
        <span className="cursor-pointer">
          <LogoutOutlined />
          <span className="ml10">退出登录</span>
        </span>
      </Menu.Item>
    </Menu>
  )
  return (
    <header className={styles.headerBar}>
      <Row className={styles.headerToggle} align="middle" justify="center" onClick={onSidebarToggle}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Row>
      <Row className={styles.headerRight} align="middle" justify="center">
        <div onClick={onToggleFullscreen} className={styles.fullscreen}>
          <FullScreenIcon />
        </div>
        <Dropdown overlay={menu} placement="bottomRight">
          <Row className={styles.user} align="middle">
            <span className={styles.name}>{user.userName || '用户名'}</span>
            <Avatar
              className={styles.avatar}
              src={user.avatar}
              icon={<img src={avatarUrl} alt="avatar"/>}
            />
            <CaretDownOutlined />
          </Row>
        </Dropdown>
      </Row>
    </header>
  )
}

export default React.memo(HeaderBar)
