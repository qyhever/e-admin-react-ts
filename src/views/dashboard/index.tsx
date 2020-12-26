import React from 'react'
import { Row, Col } from 'antd'
import CountUp from 'react-countup'
import PageWrapper from '@/components/page-wrapper'
import SvgIcon from '@/components/svg-icon'
import LineChart from './components/line'
import styles from './index.module.less'

const infoCardList = [
  {
    icon: 'circle',
    title: '在线评论',
    value: 2789
  },
  {
    icon: 'team',
    title: '新客户',
    value: 2534
  },
  {
    icon: 'message',
    title: '活跃项目',
    value: 1273
  },
  {
    icon: 'cart',
    title: '推荐',
    value: 284
  }
]

const Dashboard: React.FC = () => {
  return (
    <PageWrapper transparent padding={false}>
      <Row gutter={20}>
        {
          infoCardList.map((item, index) => (
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6} key={index}>
              <div className={styles.container}>
                <div className={styles.icon}>
                  <SvgIcon name={item.icon} className={styles[item.icon]}></SvgIcon>
                </div>
                <div className={styles.content}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.value}>
                    <CountUp end={item.value} separator=","></CountUp>
                  </p>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>
      <div className={styles.line}>
        <LineChart></LineChart>
      </div>
    </PageWrapper>
  )
}

export default Dashboard
