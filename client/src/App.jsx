import React from 'react'
import Terminal from './components/Terminal'
import Tree from './components/Tree'
import axios from 'axios'
import socket from './socket'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";




const App = () => {


  
      const [fileStructure, setfileStructure] = React.useState({})
      const [SelectedFile,Setselectedfile] = React.useState('')

  const fetchdata = async () => {

    const data = await axios.get(`${import.meta.env.VITE_API_URL}/files`)
    setfileStructure(data.data)
    console.log(fileStructure);
  }

  React.useEffect(() => {

    fetchdata()

  }, [])

  React.useEffect(()=>{
    socket.on('file:refresh',fetchdata)
    return ()=>{
      socket.off('file:refresh',fetchdata)
    }
  },[])




  return (
    <>

      <div className='main'>
        <div className='othereditor-container'>
          {/* files structure and code  */}
          <div className='files'> <Tree OnSelect={(path)=>{
            Setselectedfile(path)
          }} tree={fileStructure} /> </div>
          <div>
           <div style={{padding:'5px'}}> {SelectedFile.replaceAll('/','>')} </div>
          <div className='editor'> <AceEditor /> </div>
          </div>
        </div>
        <div className='terminal-container'><Terminal /></div>
      </div>


    </>
  )
}

export default App