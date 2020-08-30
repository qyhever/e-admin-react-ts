import React from 'react'
import { Result, Button } from 'antd'
import { RouteComponentProps } from 'react-router-dom'

interface IProps extends RouteComponentProps { }

const Exception404: React.FC<IProps> = (props) => {
  const { history } = props
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，该页面不存在"
      extra={<Button type="primary" onClick={() => history.replace('/')}>返回首页</Button>}
    />
  )
}

export default Exception404
