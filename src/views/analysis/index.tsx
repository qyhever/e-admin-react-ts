import React, { useState } from 'react'

export default function Analysis() {
  const [count, setCount] = useState(0)

  const handleAddClick = () => {
    setCount(count + 1)
  }
  const handleAlertClick = () => {
    setTimeout(() => {
      alert('you clicked on: ' + count)
    }, 2000)
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleAddClick}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  )
}
