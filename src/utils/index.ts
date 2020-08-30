import React from 'react'
import { BreadItemType, MenuConfigType } from '@/store/user/reducer'
import { CommonRouteConfig } from '@/router/routes'

// 获取包装组件的 displayName 的方法
export const getDisplayName = (WrappedComponent: React.ComponentType) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * 将一个扁平化的数组转换为树状结构
 * @param {Array} list
 * @param {Null | String} id 子节点关联属性 值
 * @param {String} key 子节点关联属性 键
 * @param {String} parentKey 父节点关联属性 键
 * @return {Array} 树状数据
 */
export const listToTree = (list: any[], id: string | null, key: string, parentKey: string) => {
  const ret: Array<any> = []
  const temp = list.filter(v => v[parentKey] === id)
  temp.forEach(item => {
    ret.push({
      ...item,
      id: String(item.id),
      children: listToTree(list, item[key], key, parentKey)
    })
  })
  return ret
}
/**
 * 判断当前路由是否拥有权限
 * @param {Array<string>} resourceCodes 当前用户拥有的所有权限 code list
 * @param {CommonRouteConfig} route 当前路由对象
 * @return {Boolean} 是否拥有权限
 */
export const hasPermission = (route: CommonRouteConfig, resourceCodes: string[]) => {
  if (route.auth && route.auth.length) {
    return route.auth.some(code => resourceCodes.includes(code))
  }
  return true
}
/**
 * 可访问菜单，从 routes 中过滤出 有权限的 menu
 * @param {Array<CommonRouteConfig>} routes 路由表
 * @param {Array<string>} resourceCodes 当前用户拥有的所有权限 code list
 * @return {Array<MenuConfigType>} 有权限的 menu list
 */
export const getAccessMenus = (routes: CommonRouteConfig[], resourceCodes: string[]) => {
  const res: MenuConfigType[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, resourceCodes)) {
      if (tmp.routes) {
        tmp.routes = getAccessMenus(tmp.routes, resourceCodes)
        if (tmp.routes.length) {
          res.push({
            path: tmp.path || '',
            title: tmp.title || '',
            icon: tmp.icon || '',
            hidden: tmp.hidden || false,
            routes: tmp.routes as MenuConfigType[]
          })
        }
      } else {
        res.push({
          path: tmp.path || '',
          title: tmp.title || '',
          icon: tmp.icon || '',
          hidden: tmp.hidden || false
        })
      }
    }
  })

  return res
}

/**
 * 根据路由表获取扁平化的面包屑列表
 * @param {Array<CommonRouteConfig>} routes 路由表
 * @return {Array<BreadItemType>} 面包屑列表
 */
export const getFlattenMenus = (routes: CommonRouteConfig[]) => {
  let result: BreadItemType[] = []
  routes.forEach(item => {
    if (typeof item.path === 'string' && item.path !== '*') {
      result.push({
        path: item.path,
        breadcrumb: item.breadcrumb || item.title
      })
    }
    if (Array.isArray(item.routes)) {
      result = result.concat(getFlattenMenus(item.routes))
    }
  })
  return result
}
