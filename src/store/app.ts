import { action, observable } from 'mobx'
import { setCollapse, getCollapse } from '@/utils/local'
import { isDefined } from '@/utils/type'

export type AppStoreType = {
  collapsed: boolean
  toggleCollapsed: (data?: boolean) => void
}

class App {
  @observable
  collapsed = Boolean(getCollapse())

  @action
  toggleCollapsed = (data?: boolean) => {
    const value = isDefined(data) ? data : !this.collapsed
    setCollapse(value)
    this.collapsed = value
  }
}

export default new App()
