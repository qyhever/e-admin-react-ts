import React, { useState } from 'react'
import { Tree } from 'antd'
import { TreeProps } from 'antd/lib/tree'
import { DataNode } from 'rc-tree/lib/interface'
type OnCheckFn = TreeProps['onCheck']
type OnExpandFn = TreeProps['onExpand']

export type ResourceTreeValueType = {
  totalKeys: (string | number)[]
  totalSubKeys: (string | number)[]
}

type IProps = {
  resourceTree: DataNode[]
  value?: ResourceTreeValueType
  onChange?: (value: ResourceTreeValueType) => void
}

const ResourceTree: React.FC<IProps> = (props) => {
  const {
    resourceTree,
    value = { totalSubKeys: [] },
    onChange
  } = props
  // console.log(value)
  const [expandedKeys, setExpandedKeys] = useState(resourceTree.map(v => v.key))
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const onExpand: OnExpandFn = expandedKeys => {
    // console.log('onExpand', expandedKeys) // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  const onCheck: OnCheckFn = (checkedKeys, { halfCheckedKeys }) => {
    const totalKeys = [...checkedKeys, ...halfCheckedKeys]
    onChange && onChange({
      totalKeys, // 传递后给后端的数据
      totalSubKeys: checkedKeys as (string | number)[] // 受控组件显示需要的勾选列表
    })
  }
  return (
    <Tree
      checkable
      selectable={false}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={value.totalSubKeys}
      treeData={resourceTree}
    >
    </Tree>
  )
}

export default React.memo(ResourceTree)
