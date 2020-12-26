import React, { useEffect } from 'react'
import { Form, Button } from 'antd'
import UploadImage from '@/components/upload'

type FormType = {
  urls: string[]
}
const User: React.FC = () => {
  const [form] = Form.useForm()
  useEffect(() => {
    const timer = setTimeout(() => {
      form.setFields([
        {
          name: 'urls',
          value: ['https://qiniu.qyhever.com/15879321501070c8ed05f88249photo_2019-09-06_17-12-29.jpg'] 
        }
      ])
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [form])

  const initialValues: FormType = {
    urls: []
  }

  const onFinish = (values: FormType) => {
    console.log(values)
  }
  return (
    <div>
      <Form
        form={form}
        name="basic"
        hideRequiredMark
        colon={false}
        labelAlign="left"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Form.Item
          name="urls"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <UploadImage></UploadImage>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default User
