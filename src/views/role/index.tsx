import React from 'react'
import { Spin, Form, Row, Col } from 'antd'
import PageWrapper from '@/components/page-wrapper'
import { queryFormColLayout } from '@/utils/layout'
import useAsync from '@/hooks/useAsync'
import { getRoles } from './service'
// import { useRequest } from 'ahooks'
import { Input, Button } from 'antd'

const Role: React.FC = () => {
  const [ form ] = Form.useForm()
  // () => getRoles({})
  const {data, loading: querying, run} = useAsync(() => {
    console.log(form.getFieldsValue())
    return getRoles({
      ...form.getFieldsValue()
    })
  })
  console.log(data)
  React.useEffect(() => {
    run()
  }, [run])
  function onReset() {
    form.resetFields()
    run()
  }
  return (
    <PageWrapper>
      <Spin spinning={querying}>
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
                <Button type="primary">添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </PageWrapper>
  )
}

export default React.memo(Role)
