import React, { useEffect } from 'react'
import { Modal, Form, Input, Radio, Select, message } from 'antd'
import { Canceler } from 'axios'
import useAsync from '@/hooks/useAsync'
import { modalFormItemLayout } from '@/utils/layout'
import UploadImage from '@/components/upload'
import { saveUser } from './service'
import { isDefined } from '@/utils/type'
import { UserListItem } from './types'
import { OptionRoleListItem } from '@/api/global'

const { Item: FormItem } = Form
const { Option } = Select

type IProps = {
  roleList: OptionRoleListItem[]
  visible: boolean
  close: () => void
  refresh: () => void
  query: () => void
  detail: UserListItem
}

const UpdateModal: React.FC<IProps> = (props) => {
  const { visible, close, refresh, query, roleList, detail } = props
  const [ form ] = Form.useForm()
  // 编辑模式，回显数据
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        avatar: detail.avatar || '',
        userName: detail.userName || '',
        fullName: detail.fullName || '',
        enable: isDefined(detail.enable) ? detail.enable : true,
        role: Array.isArray(detail.roles) ? detail.roles.map(v => v.id) : []
      })
    }
  }, [visible, form, detail])
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
    return saveUser(p, cancel => {
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
        ...values
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
    avatar: '',
    userName: '',
    fullName: '',
    password: '',
    enable: true,
    role: []
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
          name="avatar"
          label="头像"
          rules={[{ required: true, message: '请上传头像!' }]}
        >
          <UploadImage />
        </FormItem>

        <FormItem
          {...modalFormItemLayout}
          name="userName"
          label="账户名"
          rules={[{ required: true, message: '请输入账户名!' }]}
        >
          <Input placeholder="请输入账户名" allowClear autoComplete="off" />
        </FormItem>

        <FormItem
          {...modalFormItemLayout}
          name="fullName"
          label="真实姓名"
          rules={[{ required: true, message: '请输入真实姓名!' }]}
        >
          <Input placeholder="请输入真实姓名" allowClear autoComplete="off" />
        </FormItem>

        {!detail.id &&
          <FormItem
            {...modalFormItemLayout}
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input type="password" placeholder="请输入密码" allowClear autoComplete="off" />
          </FormItem>
        }

        <FormItem
          {...modalFormItemLayout}
          name="enable"
          label="状态"
          rules={[{ required: true, message: '请选择状态!' }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>启用</Radio.Button>
            <Radio.Button value={false}>禁用</Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem
          {...modalFormItemLayout}
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色!' }]}
        >
          <Select
            placeholder="请选择角色"
            allowClear
            mode="multiple"
            getPopupContainer={triggerNode => triggerNode.parentNode}>
            {roleList.map(role =>
              <Option key={role.id} value={role.id}>{role.name}</Option>
            )}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}

export default React.memo(UpdateModal)
