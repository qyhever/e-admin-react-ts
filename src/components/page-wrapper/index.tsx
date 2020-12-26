import React from 'react'
import { BackTop } from 'antd'
import classNames from 'classnames'
import styles from './index.module.less'

type IProps = {
  wrapperClass?: string
  containerClass?: string
  isColmun?: boolean
  transparent?: boolean
  padding?: boolean
}

const PageWrapper: React.FC<IProps> = (props) => {
  const { wrapperClass, containerClass, isColmun, transparent, padding } = props
  const pageWrapperCls = classNames(
    styles.pageWrapper,
    wrapperClass,
    {
      [styles.isColumn]: isColmun,
      [styles.transparent]: transparent,
      [styles.padding]: padding
    }
  )
  return (
    <div className={pageWrapperCls}>
      <div className={`${styles.pageContainer} ${containerClass}`}>
        {props.children}
      </div>
      <BackTop className={styles.backTop} />
    </div>
  )
}
PageWrapper.defaultProps = {
  wrapperClass: '',
  containerClass: '',
  isColmun: false,
  transparent: false,
  padding: true
}

export default PageWrapper
