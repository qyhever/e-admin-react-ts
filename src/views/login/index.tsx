import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { Store } from 'rc-field-form/lib/interface'
import md5 from 'md5'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import styles from './index.module.less'
import { LoginParamsType } from './service'
import { loginByAccount } from '@/store/user/action'
import { getRememberUser, setRememberUser, removeRememberUser } from '@/utils/local'

interface IProps extends RouteComponentProps {
  loginByAccount: (data: LoginParamsType) => any
}

const Login: React.FC<IProps> = props => {
  const { loginByAccount: loginByAccountDispatch } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (form) {
      const rememberUser = getRememberUser()
      if (rememberUser) {
        form.setFieldsValue(rememberUser)
      }
    }
  }, [form])

  const onFinish = (values: Store) => {
    if (values.remember) {
      setRememberUser(values)
    } else {
      removeRememberUser()
    }
    const params = {
      userName: values.userName,
      password: md5(md5(values.password))
    }
    loginByAccountDispatch({
      loadingCb: v => setLoading(v),
      data: params
    })
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <h1 className={styles.title}>登录</h1>
        </div>
        <Form
          className={styles.form}
          form={form}
          name="basic"
          hideRequiredMark
          colon={false}
          labelAlign="left"
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item
            name="userName"
            hasFeedback
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder="输入账号" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="password"
            hasFeedback
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="输入密码" maxLength={25} />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button className={styles.buttonSubmit} type="primary" htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

// const mapStateToProps = (state: AppState) => ({
//   userInfo: state.user.userInfo
// })
const mapDispatchToProps = {
  loginByAccount
}

export default connect(
  null,
  mapDispatchToProps
)(React.memo(Login))
