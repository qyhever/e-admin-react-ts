import React from 'react'
import useAsync from '@/hooks/useAsync'
import { getRoles } from './service'
// import { useRequest } from 'ahooks'
import { Input, Button } from 'antd'

const Role: React.FC = () => {
  // () => getRoles({})
  const [name, setName] = React.useState('')
  const {data, run} = useAsync(() => {
    // console.log(name)
    return getRoles({name})
  })
  // console.log(result)
  React.useEffect(() => {
    run()
  }, [run])
  return (
    <div>
      Role
      <Input value={name} onChange={e => setName(e.target.value)}></Input>
      <Button type="primary" onClick={run}>submit</Button>
    </div>
  )
}

export default Role
