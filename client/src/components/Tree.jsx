const FileTreeNode = ({ FileName, Node , OnSelect , Path }) => {
    const isDir = !!Node
    return (
        <>
            <div
             style={{ margin: '22px' }}
             onClick={(e)=>{e.stopPropagation() 
                if(isDir) return;
                OnSelect(Path);
            }
            
            }
             >{FileName}</div>
            {Node && (
                <ul style={{ listStyle:"disc",paddingLeft:"20px" }}>
                {Object.keys(Node).map((child) => {
                    return (
                    <li style={{listStyle:"none"}} key={child}>
                        <FileTreeNode Path={Path + '/' + child} OnSelect={OnSelect}  FileName={child} Node={Node[child]} />
                    </li>
                    )

                })}
            </ul>
        )}
        </>

    )
}

const FileTree = ({ tree, OnSelect }) => {
    return (
        <>
            <FileTreeNode FileName="/" Node={tree} OnSelect={OnSelect} Path="" />

        </>
    )
}

export default FileTree;