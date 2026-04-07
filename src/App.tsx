import { useState } from 'react'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React + TypeScript App 🚀</h1>
      <h2>Counter: {count}</h2>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default App