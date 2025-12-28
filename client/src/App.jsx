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

  const [SelectedFilecontent,SetselectedFIleContent] = React.useState('')
  const [code, setcode] = React.useState('')
  const [fileStructure, setfileStructure] = React.useState({})
  const [SelectedFile, Setselectedfile] = React.useState('')

 const isSaved =  SelectedFilecontent == code

  const fetchdata = async () => {

    const data = await axios.get(`${import.meta.env.VITE_API_URL}/files`)
    setfileStructure(data.data)
    console.log(fileStructure);
  }

  const getselectedfilecontent = async ()=>{
   if(!SelectedFile) return;
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/files/content?path=${SelectedFile}`)
     console.log(res);
     SetselectedFIleContent(res.data.content)
     console.log(SelectedFilecontent);
     

  }
 React.useEffect(()=>{
if( SelectedFile ) getselectedfilecontent()
 },[getselectedfilecontent,SelectedFile])

  React.useEffect(() => {

    fetchdata()

  }, [])

  React.useEffect(() => {
    socket.on('file:refresh', fetchdata)
    return () => {
      socket.off('file:refresh', fetchdata)
    }
  }, [])

  React.useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
      socket.emit('file:changed',{
        path:SelectedFile,
        content:code
      })
      console.log('code saved',code);
      
      }, 2 * 1000)
      return () => {
        clearTimeout(timer)
      }
    }


  }, [code])

React.useEffect(() => {
  
if(SelectedFile && SelectedFilecontent){
  setcode(SelectedFilecontent)
}
 
}, [SelectedFile,SelectedFilecontent])

React.useEffect(()=>{
setcode("")
},[SelectedFile])

  return (
    <>

      <div className='main'>
        <div className='othereditor-container'>
          {/* files structure and code  */}
          <div className='files'> <Tree OnSelect={(path) => {
            Setselectedfile(path)
          }} tree={fileStructure} /> </div>
          <div className='editorparent'>
            <div style={{ padding: '5px' }}> {SelectedFile.replaceAll('/', '>')} {isSaved ? 'saved': 'NOt saved'} </div>
            <div className='editor'> <AceEditor width="100%" value={code} onChange={(e) => { setcode(e) }} /> </div>
          </div>
        </div>
        <div className='terminal-container'><Terminal /></div>
      </div>


    </>
  )
}

export default App