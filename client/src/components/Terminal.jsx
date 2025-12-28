import React from 'react'
import {  useEffect, useRef } from 'react'
import {Terminal as Xterminal} from '@xterm/xterm'
import "@xterm/xterm/css/xterm.css";
import socket from '../socket'

const Terminal = () => {

    const terminalRef = useRef(null);
    const isrendered = useRef(false);


   useEffect(()=>{
    if(isrendered.current) return;
    isrendered.current = true;
    const terminal = new Xterminal({
       
        rows:10
    });
    terminal.open(terminalRef.current); 

    // writing and sending data to server
    terminal.onData((data)=>{
    socket.emit('terminal:write',data);
   })
   
    socket.on('terminal:data',(data)=>{
        terminal.write(data);
    })

   },[])

  return (
    <div ref={terminalRef}>

    </div>
  )
}

export default Terminal