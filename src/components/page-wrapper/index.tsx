import React from 'react'
import { BackTop } from 'antd'
import styles from './index.module.less'

type IProps = {
  wrapperClass?: string
  containerClass?: string
}
const PageWrapper: React.FC<IProps> = (props) => {
  const { wrapperClass, containerClass } = props
  return (
    <div className={`${styles.pageWrapper} ${wrapperClass}`}>
      <div className={`${styles.pageContainer} ${containerClass}`}>
        {props.children}
      </div>
      <BackTop className={styles.backTop} />
    </div>
  )
}
PageWrapper.defaultProps = {
  wrapperClass: '',
  containerClass: ''
}

export default PageWrapper
