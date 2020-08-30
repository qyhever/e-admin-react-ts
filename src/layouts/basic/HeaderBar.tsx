import React from 'react'
import { Dropdown, Menu, Row } from 'antd'
import { History } from 'history'
// import { MenuInfo } from 'rc-menu/lib/interface'
import { ClickParam } from 'antd/lib/menu'
import styles from './index.module.less'
import { CaretDownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'
import avatarUrl from '@/assets/images/user.png'
import { removeUserData } from '@/utils/local'
import { CurrentUserType } from '@/store/user/reducer'

type IProps = {
  collapsed: boolean
  onToggle: () => void
  user: CurrentUserType
  history: History
}
const HeaderBar: React.FC<IProps> = props => {
  const { collapsed, onToggle, user } = props
  // MenuInfo https://github.com/ant-design/ant-design/issues/25467
  const handleMenuClick = ({ key }: ClickParam) => {
    if (key === 'logout') {
      removeUserData()
      window.location.reload()
    }
  }
  const onSidebarToggle = () => {
    onToggle()
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
      <div className={styles.headerRight}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Row className={styles.user} align="middle">
            <span className={styles.name}>{user.userName || '用户名'}</span>
            <img className={styles.avatar} src={user.avatar || avatarUrl} alt="avatar" />
            <CaretDownOutlined />
          </Row>
        </Dropdown>
      </div>
    </header>
  )
}

export default React.memo(HeaderBar)
