import React, { useEffect, useState } from 'react'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import myScreenfull from 'screenfull'

const screenfull = myScreenfull as screenfull.Screenfull

const FullScreenIcon = () => {
  const [isFullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    const onScreenfullChange = () => {
      setFullscreen(screenfull.isFullscreen)
    }
    onScreenfullChange()
    screenfull.on('change', onScreenfullChange)
    return () => {
      screenfull.off('change', onScreenfullChange)
    }
  }, [])
  return isFullscreen ? (
    <Tooltip title={'退出全屏'}>
      <FullscreenExitOutlined />
    </Tooltip>
  ) : (
    <Tooltip title={'全屏'}>
      <FullscreenOutlined />
    </Tooltip>
  )
}

export default React.memo(FullScreenIcon)
