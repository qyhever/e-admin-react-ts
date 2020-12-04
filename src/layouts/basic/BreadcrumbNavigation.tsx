import React from 'react'
import { NavLink } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import withBreadcrumbs, { InjectedProps } from 'react-router-breadcrumbs-hoc'
import styles from './index.module.less'
import { BreadsType } from '@/store/user'

/**
 * examples
 */
// const routes = [
//   { path: '/', breadcrumb: '首页' },
//   { path: '/dashboard', breadcrumb: '控制台' },
//   { path: '/form', breadcrumb: '表单' },
//   { path: '/form/basic', breadcrumb: '表单' }
// ]

type IProps = InjectedProps
const BreadcrumbComponent: React.FC<IProps> = (({ breadcrumbs }) => {
  console.log(breadcrumbs)
  return (
    <Breadcrumb className={styles.bread}>
      {breadcrumbs.map((breadcrumb: any) => (
        <Breadcrumb.Item key={breadcrumb.key}>
          {breadcrumb.match.url === '/' ?
            <NavLink to={breadcrumb.match.url}>
              {breadcrumb.breadcrumb.props.children}
            </NavLink> :
            <span>{breadcrumb.breadcrumb.props.children}</span>
          }
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
})

const BreadcrumbNavigation: React.FC<{breadcrumbs: BreadsType}> = ({ breadcrumbs = [] }) => {
  const BreadWrapper = withBreadcrumbs(breadcrumbs)(BreadcrumbComponent)
  return <BreadWrapper/>
}
export default BreadcrumbNavigation
