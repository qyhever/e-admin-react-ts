import React, { useEffect, useMemo } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { DataNode } from 'rc-tree/lib/interface'
import { Canceler } from 'axios'
import useAsync from '@/hooks/useAsync'
import { modalFormItemLayout } from '@/utils/layout'
import ResourceTree from './resource-tree'
import { listToTree } from '@/utils'
import { saveRole } from './service'
import { RoleListItem } from './types'
import { ResourceItem } from '@/views/resource/types'

const { Item: FormItem } = Form

type IProps = {
  resourceList: ResourceItem[]
  visible: boolean
  close: () => void
  refresh: () => void
  query: () => void
  detail: RoleListItem
}

const UpdateModal: React.FC<IProps> = (props) => {
  const { resourceList } = props
  const { visible, close, refresh, query, detail } = props
  const [ form ] = Form.useForm()
  const resourceTree = useMemo(() => {
    const tree = listToTree(resourceList, null, 'code', 'parentCode')
    const normalizeTreeData = (treeData: ResourceItem[]): DataNode[] => {
      return treeData.map(item => {
        if (Array.isArray(item.children) && item.children.length) {
          return {
            key: Number(item.id),
            title: item.name,
            children: normalizeTreeData(item.children)
          }
        }
        return {
          key: Number(item.id),
          title: item.name
        }
      })
    }
    return normalizeTreeData(tree)
  }, [resourceList])
  // 编辑模式，回显数据
  useEffect(() => {
    if (visible) {
      const { id, name, description, resources = [] } = detail
      const list = id ? resources : resourceList
      /**
       * totalKeys: 需要传递给后端的数据，包含父节点和叶子节点（父节点和叶子节点 每个节点对应一个权限）
       * totalSubKeys: tree 用作显示的数据，只需要 叶子节点 数据（因为有半选的存在，半选：根据叶子节点是否全部勾选来确定）
       * 关键点在于：tree 用作显示的数据 和 传递后后端的数据不一致
       */
      const totalKeys = list.map(v => v.id)
      const totalSubKeys = list.filter(item => item.type === '2').map(v => v.id)

      form.setFieldsValue({
        name: name || '',
        description: description || '',
        resources: {
          totalKeys,
          totalSubKeys
        }
      })
    }
  }, [visible, form, detail, resourceList])
  let cancelSaveReq: Canceler | null = null
  const onSubmitSuccess = () => {
    message.destroy()
    message.success(detail.id ? '编辑成功' : '添加成功')
    form.resetFields()
    close()
    detail.id ? refresh() : query()
  }
  // create
  const { loading: submitting, run: save } = useAsync((p) => {
    return saveRole(p, cancel => {
      cancelSaveReq = cancel
    })
  }, {
    manual: true,
    onSuccess: () => {
      onSubmitSuccess()
    }
  })
  const onCancel = () => {
    cancelSaveReq && cancelSaveReq()
    form.resetFields()
    close()
  }
  const onOk = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      const formData = {
        ...values,
        resources: values.resources.totalKeys
      }
      const { id } = detail
      if (id) {
        formData.id = id
      }
      console.log(formData)
      save(formData)
    } catch (error) {
      console.log(error)
    }
  }
  const initialValues = {
    name: '',
    description: '',
    resources: {
      totalKeys: [],
      totalSubKeys: []
    }
  }
  return (
    <Modal
      visible={visible}
      title={detail.id ? '编辑' : '添加'}
      width={600}
      onCancel={onCancel}
      maskClosable={false}
      onOk={onOk}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        initialValues={initialValues}
      >
        <FormItem
          {...modalFormItemLayout}
          name="name"
          label="角色名"
          rules={[{ required: true, message: '请输入角色名!' }]}
        >
          <Input placeholder="请输入角色名" allowClear autoComplete="off" />
        </FormItem>

        <FormItem
          {...modalFormItemLayout}
          name="description"
          label="角色描述"
          rules={[{ required: true, message: '请输入角色描述!' }]}
        >
          <Input placeholder="请输入角色描述" allowClear autoComplete="off" />
        </FormItem>

        <FormItem
          {...modalFormItemLayout}
          name="resources"
          label="可用权限"
          rules={[{ required: true, message: '请选择权限!' }]}
        >
          <ResourceTree resourceTree={resourceTree}></ResourceTree>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default React.memo(UpdateModal)
