import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Row, Col, Spin, Table, Switch, Modal, message } from 'antd'
import { ColumnsType, TableProps } from 'antd/lib/table'
import { SorterResult } from 'antd/lib/table/interface'
import { Canceler } from 'axios'
import { useBoolean } from 'ahooks'
import PageWrapper from '@/components/page-wrapper'
import { queryFormColLayout } from '@/utils/layout'
import { formatDateTime } from '@/utils/date'
import { useAsync, useKeepFn } from '@/hooks'
import { getResources, deleteResource, getDirs, patchResource } from './service'
import UpdateModal from './update-modal'
import { ResourceItem } from './types'

type OnTableChangeType = TableProps<ResourceItem>['onChange']

const { Option } = Select
const { Item: FormItem } = Form

const initPaginationParams = {
  page: 1,
  size: 10
}

const Resource: React.FC = () => {
  const [ form ] = Form.useForm()
  const [pager, setPager] = useState<BasicTableParams>(initPaginationParams)
  const [ detail, setDetail ] = useState({} as ResourceItem)
  // 查询目录资源
  const { data: dirData, loading: dirQuerying } = useAsync(getDirs, {
    initialData: []
  })
  const dirs = [
    {
      id: 0,
      name: '无',
      code: null
    },
    ...dirData
  ]
  // 切换资源状态
  const { loading: toggling, run: toggleEnable } = useAsync(patchResource, {
    manual: true
  })

  // Modal control
  const [ visible, { setTrue: openModal, setFalse: closeModal } ] = useBoolean(false)

  // 关闭 modal 时，清空 detail
  useEffect(() => {
    if (!visible) {
      setDetail({} as ResourceItem)
    }
  }, [visible])

  // 资源列表数据
  const {data, loading: querying, run, mutate} = useAsync(() => {
    return getResources({
      ...form.getFieldsValue(),
      ...pager
    })
  }, {
    initialData: {
      list: [],
      total: 0
    }
  })
  const { list: resourceList, total } = data

  const refresh = useKeepFn(() => {
    setPager(initPaginationParams)
    setTimeout(() => {
      run()
    }, 20)
  })
  
  function onReset() {
    form.resetFields()
    run()
  }

  const onTableChange: OnTableChangeType = (pagination, filters, sorter: SorterResult<ResourceItem>) => {
    const p = {
      ...pager,
      page: pagination.current,
      size: pagination.pageSize
    }
    if (sorter.field && sorter.order) {
      p.sortProp = sorter.field as string
      p.sortOrder = sorter.order === 'ascend' ? 1 : -1
    } else {
      p.sortProp = undefined
      p.sortOrder = undefined
    }
    setPager(p)
    setTimeout(() => {
      run()
    }, 20)
  }

  let cancelDeleteReq: Canceler | null = null
  // 删除请求
  const { loading: deletting, run: runDelete } = useAsync((p) => {
    return deleteResource(p, c => {
      cancelDeleteReq = c
    })
  }, {
    manual: true,
    onSuccess: () => {
      message.destroy()
      message.success('删除成功')
      run() // 刷新表格数据
    }
  })
  // 删除操作
  const onDelete = (record: ResourceItem) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除吗？',
      centered: true,
      onOk: async () => {
        return runDelete({
          id: record.id,
          type: record.type === '2' ? 'resource' : 'dir'
        })
      },
      onCancel: () => {
        cancelDeleteReq && cancelDeleteReq()
      }
    })
  }
  // 打开编辑 modal
  const onUpdate = (record: ResourceItem) => {
    setDetail(record)
    openModal()
  }
  // 切换状态
  const onToggleEnable = (record: ResourceItem) => {
    toggleEnable({
      id: record.id,
      enable: !record.enable
    })
    const list = resourceList.map(item => {
      if (item.id === record.id) {
        return {
          ...item,
          enable: !item.enable
        }
      }
      return item
    })
    // 突变，主动修改数据
    mutate({
      list,
      total
    })
  }

  const columns: ColumnsType<ResourceItem> = [{
    title: '权限名',
    align: 'center',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '权限编码',
    align: 'center',
    dataIndex: 'code',
    key: 'code'
  }, {
    title: '类型',
    align: 'center',
    dataIndex: 'type',
    key: 'type',
    render: (text: string) => {
      return <span>{text === '1' ? '目录' : '资源'}</span>
    }
  }, {
    title: '启用状态',
    align: 'center',
    dataIndex: 'enable',
    key: 'enable',
    render: (text: boolean, record) => {
      return <Switch checked={text} onChange={() => onToggleEnable(record)} />
    }
  }, {
    title: '添加时间',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (text: string) => <span>{text ? formatDateTime(text) : '-'}</span>
  }, {
    title: '修改时间',
    align: 'center',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: true,
    render: (text: string) => <span>{text ? formatDateTime(text) : '-'}</span>
  }, {
    title: '操作',
    align: 'center',
    dataIndex: 'operation',
    key: 'operation',
    render: (_, record) => {
      return (
        <span>
          <Button type="link" onClick={() => onUpdate(record)}>编辑</Button>
          <Button type="link" onClick={() => onDelete(record)}>删除</Button>
        </span>
      )
    }
  }]

  return (
    <PageWrapper>
      <Spin spinning={querying || deletting || dirQuerying || toggling}>
        <Form
          form={form}
        >
          <Row gutter={24}>
            <Col {...queryFormColLayout}>
              <FormItem
                name="name"
                label="权限名"
              >
                <Input placeholder="请输入权限名" allowClear autoComplete="off" />
              </FormItem>
            </Col>
            <Col {...queryFormColLayout}>
              <FormItem
                name="code"
                label="权限编码"
              >
                <Input placeholder="请输入权限编码" allowClear autoComplete="off" />
              </FormItem>
            </Col>
            <Col {...queryFormColLayout}>
              <FormItem
                name="type"
                label="类型"
              >
                <Select
                  placeholder="请选择类型"
                  allowClear
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Option value="">全部</Option>
                  <Option value="1">目录</Option>
                  <Option value="2">资源</Option>
                </Select>
              </FormItem>
            </Col>
            <Col {...queryFormColLayout}>
              <FormItem wrapperCol={{offset: 2}}>
                <Button type="primary" onClick={run}>查询</Button>
                <Button onClick={onReset}>重置</Button>
                <Button type="primary" onClick={openModal}>添加</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={resourceList}
          onChange={onTableChange}
          loading={false}
          pagination={{
            current: pager.page,
            pageSize: pager.size,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`
          }}
        >
        </Table>
      </Spin>
      <UpdateModal
        visible={visible}
        close={closeModal}
        dirs={dirs}
        refresh={refresh}
        query={run}
        detail={detail}
      />
    </PageWrapper>
  )
}

export default Resource
