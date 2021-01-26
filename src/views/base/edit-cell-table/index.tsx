import React, { useState } from 'react'
import { Spin, Form, Row, Col, Input, Button, Table, Popconfirm } from 'antd'
import { TableProps } from 'antd/lib/table'
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface'
import { ColumnsType } from 'rc-table/lib/interface'
import PageWrapper from '@/components/page-wrapper'
import { queryFormColLayout } from '@/utils/layout'
import { formatDateTime } from '@/utils/date'
import { useAsync } from '@/hooks'
import { getRoles, saveRole } from '@/views/role/service'
import { RoleListItem } from '@/views/role/types'
import styles from './index.module.less'
type OnTableChangeType = TableProps<RoleListItem>['onChange']

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  record: RoleListItem
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`
            }
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const initPaginationParams = {
  page: 1,
  size: 10
}

const EditableTable: React.FC = () => {
  const [ queryForm ] = Form.useForm()
  const [ editForm ] = Form.useForm()
  const [editingId, setEditingId] = useState(0)
  const isEditing = (record: RoleListItem) => record.id === editingId
  const [pager, setPager] = useState<BasicTableParams>(initPaginationParams)

  const {data, loading: querying, run, mutate} = useAsync(() => {
    return getRoles({
      ...queryForm.getFieldsValue(),
      ...pager
    })
  }, {
    initialData: {
      list: [],
      total: 0
    }
  })
  const { list: roleList, total } = data

  function onReset() {
    queryForm.resetFields()
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

  // 保存请求
  const { loading: submitting, run: save } = useAsync(saveRole, {
    manual: true,
    onSuccess: () => {
      setEditingId(0)
    }
  })

  function onUpdate(record: RoleListItem) {
    editForm.setFieldsValue({ ...record })
    setEditingId(record.id)
  }

  function onCancel() {
    setEditingId(0)
  }

  async function onSave(record: RoleListItem) {
    try {
      const row = (await editForm.validateFields()) as RoleListItem
      const list = roleList.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            ...row
          }
        }
        return item
      })
      mutate({
        total,
        list
      })
      const formData = {
        ...row,
        id: record.id,
        resources: record.resources.map(v => v.id)
      }
      save(formData)
    } catch (err) {
      console.log('Validate Failed: ', err)
    }
  }

  function onBatchUpdate() {
    console.log('onBatchUpdate')
  }

  const rowSelection: TableRowSelection<RoleListItem> = {
    type: 'checkbox',
    columnWidth: 60,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRows: ', selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === '超级管理员', // Column configuration not to be checked
      name: record.name
    })
  }

  const columns = [{
    title: '角色名',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    editable: true
  }, {
    title: '角色描述',
    align: 'center',
    dataIndex: 'description',
    key: 'description',
    editable: true
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
    render: (_: any, record: RoleListItem) => {
      if (record.name === '超级管理员') {
        return <span>-</span>
      }
      const editable = isEditing(record)
      return editable ? (
        <span>
          <Button type="link" onClick={() => onSave(record)}>
            保存
          </Button>
          <Popconfirm title="确定要取消吗?" onConfirm={onCancel}>
            <Button type="link">取消</Button>
          </Popconfirm>
        </span>
      ) : (
        <span>
          <Button type="link" disabled={editingId !== 0} onClick={() => onUpdate(record)}>编辑</Button>
        </span>
      )
    }
  }]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: RoleListItem) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <PageWrapper>
      <Spin spinning={querying || submitting}>
        <Form
          form={queryForm}
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
                <Button type="primary" onClick={onBatchUpdate}>批量修改</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form
          form={editForm}
        >
          <Table
            className={styles.editTable}
            rowKey="id"
            rowClassName="editable-row"
            components={{
              body: {
                cell: EditableCell
              }
            }}
            rowSelection={rowSelection}
            columns={mergedColumns as ColumnsType}
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
        </Form>
      </Spin>
    </PageWrapper>
  )
}

export default EditableTable
