import React from 'react'
import Terminal from './components/Terminal'

const App = () => {
  // 
  return (
    <>

      <div className='main'>
        <div className='othereditor-container'>
          {/* files structure and code  */}
          <div></div>
          <div></div>
        </div>
        <div className='terminal-container'><Terminal /></div>
      </div>


    </>
  )
}

export default App