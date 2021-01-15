import React, { useState, useEffect } from 'react'
import { Spin, Form, Row, Col, Input, Button, Table, message, Modal } from 'antd'
import { useBoolean } from 'ahooks'
import { ColumnsType, TableProps } from 'antd/lib/table'
import { SorterResult } from 'antd/lib/table/interface'
import { Canceler } from 'axios'
import PageWrapper from '@/components/page-wrapper'
import { queryFormColLayout } from '@/utils/layout'
import { formatDateTime } from '@/utils/date'
import { useAsync, useKeepFn } from '@/hooks'
import { getRoles, deleteRole } from './service'
import { RoleListItem } from './types'
import { getTotalResources } from '@/api/global'
import UpdateModal from './update-modal'
type OnTableChangeType = TableProps<RoleListItem>['onChange']

const initPaginationParams = {
  page: 1,
  size: 10
}

const Role: React.FC = () => {
  const [ form ] = Form.useForm()
  const [pager, setPager] = useState<BasicTableParams>(initPaginationParams)
  const [ detail, setDetail ] = useState({} as RoleListItem)
  // 查询所有权限
  const { data: resourceList, loading: resourceQuerying } = useAsync(getTotalResources, {
    initialData: []
  })

  // Modal control
  const [ visible, { setTrue: openModal, setFalse: closeModal } ] = useBoolean(false)

  // 关闭 modal 时，清空 detail
  useEffect(() => {
    if (!visible) {
      setDetail({} as RoleListItem)
    }
  }, [visible])
  
  const {data, loading: querying, run} = useAsync(() => {
    return getRoles({
      ...form.getFieldsValue(),
      ...pager
    })
  }, {
    initialData: {
      list: [],
      total: 0
    }
  })
  const { list: roleList, total } = data

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
  const onTableChange: OnTableChangeType = (pagination, filters, sorter: SorterResult<RoleListItem>) => {
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
    return deleteRole(p, c => {
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
  function onDelete(record: RoleListItem) {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除吗？',
      centered: true,
      onOk: async () => {
        return runDelete({
          id: record.id
        })
      },
      onCancel: () => {
        cancelDeleteReq && cancelDeleteReq()
      }
    })
  }
  function onUpdate(record: RoleListItem) {
    setDetail(record)
    openModal()
  }
  const columns: ColumnsType<RoleListItem> = [{
    title: '角色名',
    align: 'center',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '角色描述',
    align: 'center',
    dataIndex: 'description',
    key: 'description'
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
      if (record.name === '超级管理员') {
        return <span>-</span>
      }
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
      <Spin spinning={querying || deletting || resourceQuerying}>
        <Form
          form={form}
        >
          <Row>
            <Col {...queryFormColLayout}>
              <Form.Item
                name="name"
                label="角色名"
                initialValue=""
              >
                <Input placeholder="请输入角色名" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col {...queryFormColLayout}>
              <Form.Item wrapperCol={{offset: 2}}>
                <Button type="primary" onClick={run}>查询</Button>
                <Button onClick={onReset}>重置</Button>
                <Button type="primary" onClick={openModal}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={roleList}
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
        resourceList={resourceList}
        refresh={refresh}
        query={run}
        detail={detail}
      />
    </PageWrapper>
  )
}

export default React.memo(Role)
