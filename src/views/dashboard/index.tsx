import React from 'react'
import PageWrapper from '@/components/page-wrapper'

const Dashboard: React.FC = () => {
  return (
    <PageWrapper>
      {Array(50).fill(null).map((_, index) =>
        <h2 key={index}>Dashboard</h2>
      )}
    </PageWrapper>
  )
}

export default React.memo(Dashboard)
