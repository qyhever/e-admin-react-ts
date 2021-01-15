import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Spin, Form, Row, Col, Input, Button, Table, message, Modal, Avatar, Switch, Select } from 'antd'
import { useBoolean } from 'ahooks'
import { ColumnsType, TableProps } from 'antd/lib/table'
import { SorterResult } from 'antd/lib/table/interface'
import { Canceler } from 'axios'
import PageWrapper from '@/components/page-wrapper'
import { queryFormColLayout } from '@/utils/layout'
import { formatDateTime } from '@/utils/date'
import { useAsync, useKeepFn } from '@/hooks'
import { getUsers, deleteUser, patchUser } from './service'
import { QueryUserListFormData, UserListItem } from './types'
import { getTotalRoles } from '@/api/global'
import UpdateModal from './update-modal'
type OnTableChangeType = TableProps<UserListItem>['onChange']

const { Option } = Select

const initPaginationParams = {
  page: 1,
  size: 10
}

const User: React.FC = () => {
  const [form] = Form.useForm<QueryUserListFormData>()
  const history = useHistory()
  const [pager, setPager] = useState<BasicTableParams>(initPaginationParams)
  const [detail, setDetail] = useState({} as UserListItem)

  // 查询所有角色
  const { data: roleList, loading: roleQuerying } = useAsync(getTotalRoles, {
    initialData: []
  })
  // 切换状态请求
  const { loading: toggling, run: toggleEnable } = useAsync(patchUser, {
    manual: true
  })

  // Modal control
  const [visible, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false)

  // 关闭 modal 时，清空 detail
  useEffect(() => {
    if (!visible) {
      setDetail({} as UserListItem)
    }
  }, [visible])

  // 查询用户列表
  const { data, loading: querying, run, mutate } = useAsync(() => {
    return getUsers({
      ...form.getFieldsValue(),
      ...pager
    })
  }, {
    initialData: {
      list: [],
      total: 0
    }
  })
  const { list: userList, total } = data

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

  const onTableChange: OnTableChangeType = (pagination, filters, sorter: SorterResult<UserListItem>) => {
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
    return deleteUser(p, c => {
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
  function onDelete(record: UserListItem) {
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
  function onUpdate(record: UserListItem) {
    setDetail(record)
    openModal()
  }

  // 切换状态
  const onToggleEnable = (record: UserListItem) => {
    toggleEnable({
      id: record.id,
      enable: !record.enable
    })
    const list = userList.map(item => {
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
  // 查看详情
  const onPreview = (record: UserListItem) => {
    history.push(`/user/detail?id=${record.id}`)
  }

  const columns: ColumnsType<UserListItem> = [{
    title: '头像',
    align: 'center',
    dataIndex: 'avatar',
    key: 'avatar',
    // render: text => <img src={text} className="avatar" alt="加载失败" />
    render: text => <Avatar src={text} />
  }, {
    title: '用户名',
    align: 'center',
    dataIndex: 'userName',
    key: 'userName'
  }, {
    title: '真实姓名',
    align: 'center',
    dataIndex: 'fullName',
    key: 'fullName'
  }, {
    title: '角色',
    align: 'center',
    dataIndex: 'roles',
    key: 'roles',
    render: (text: UserListItem['roles']) => {
      if (text && text.length) {
        return text.map(role =>
          <span key={role.id}>{role.name}<br /></span>
        )
      }
      return <span>-</span>
    }
  }, {
    title: '启用状态',
    align: 'center',
    dataIndex: 'enable',
    key: 'enable',
    render: (text, record) => {
      const disabled = record.userName === 'admin'
      if (disabled) {
        return <span>-</span>
      }
      return <Switch checked={text} onChange={() => onToggleEnable(record)} />
    }
  }, {
    title: '添加时间',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
    render: (text) => <span>{text ? formatDateTime(text) : '-'}</span>
  }, {
    title: '修改时间',
    align: 'center',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    sorter: true,
    render: (text) => <span>{text ? formatDateTime(text) : '-'}</span>
  }, {
    title: '操作',
    align: 'center',
    dataIndex: 'operation',
    key: 'operation',
    render: (_, record) => {
      if (record.userName === 'admin') {
        return <span>-</span>
      }
      return (
        <span>
          <Button type="link" onClick={() => onPreview(record)}>查看</Button>
          <Button type="link" onClick={() => onUpdate(record)}>编辑</Button>
          <Button type="link" onClick={() => onDelete(record)}>删除</Button>
        </span>
      )
    }
  }]
  return (
    <PageWrapper>
      <Spin spinning={querying || toggling || deletting || roleQuerying}>
        <Form
          form={form}
        >
          <Row gutter={24}>
            <Col {...queryFormColLayout}>
              <Form.Item
                name="userName"
                label="用户名"
                initialValue=""
              >
                <Input placeholder="请输入用户名" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col {...queryFormColLayout}>
              <Form.Item
                name="fullName"
                label="真实姓名"
                initialValue=""
              >
                <Input placeholder="请输入真实姓名" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col {...queryFormColLayout}>
              <Form.Item
                name="enable"
                label="启用状态"
                initialValue=""
              >
                <Select
                  placeholder="请选择状态"
                  allowClear
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Option value="">全部</Option>
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col {...queryFormColLayout}>
              <Form.Item wrapperCol={{ offset: 2 }}>
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
          dataSource={userList}
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
        roleList={roleList}
        refresh={refresh}
        query={run}
        detail={detail}
      />
    </PageWrapper>
  )
}

export default React.memo(User)
