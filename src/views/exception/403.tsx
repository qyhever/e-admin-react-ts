import React from 'react'
import { Result, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface IProps extends RouteComponentProps { }

const Exception403: React.FC<IProps> = (props) => {
  const { history } = props
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该页面"
      extra={<Button type="primary" onClick={() => history.replace('/')}>返回首页</Button>}
    />
  )
}

export default withRouter(Exception403)
