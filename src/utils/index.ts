import React from 'react'
import { RouteConfig } from 'react-router-config'
import { BreadItemType, MenuItemType } from '@/store/user'
import { isString } from '@/utils/type'

const s4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export const genGuid = () => {
  return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4())
}

// 获取包装组件的 displayName 的方法
export const getDisplayName = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const getRandomStr = () => {
  return new Date().getTime() + Math.random().toString(16).slice(2)
}

export const getTitle = (title: string | undefined) => {
  const baseTitle = 'e-admin'
  if (!title) {
    return baseTitle
  }
  return `${baseTitle} - ${title}`
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
 * @param {RouteConfig} route 当前路由对象
 * @return {Boolean} 是否拥有权限
 */
export const hasPermission = (route: RouteConfig, resourceCodes: string[]) => {
  if (Array.isArray(route.auth) && route.auth.length) {
    return route.auth.some(code => resourceCodes.includes(code))
  }
  return true
}
/**
 * 可访问菜单，从 routes 中过滤出 有权限的 menu
 * @param {Array<RouteConfig>} routes 路由表
 * @param {Array<string>} resourceCodes 当前用户拥有的所有权限 code list
 * @return {Array<MenuItemType>} 有权限的 menu list
 */
export const getAccessMenus = (routes: RouteConfig[], resourceCodes: string[]) => {
  const res: MenuItemType[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp, resourceCodes)) {
      if (tmp.routes) {
        tmp.routes = getAccessMenus(tmp.routes, resourceCodes)
        if (tmp.routes.length) {
          res.push({
            path: isString(tmp.path) ? tmp.path : '',
            title: tmp.title || '',
            icon: tmp.icon || '',
            hidden: tmp.hidden || false,
            routes: tmp.routes as MenuItemType[]
          })
        }
      } else {
        res.push({
          path: isString(tmp.path) ? tmp.path : '',
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
 * @param {Array<RouteConfig>} routes 路由表
 * @return {Array<BreadItemType>} 面包屑列表
 */
export const getFlattenMenus = (routes: RouteConfig[]) => {
  let result: BreadItemType[] = []
  routes.forEach(item => {
    if (isString(item.path) && item.path !== '*') {
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
