import React, { useState } from "react";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import JavascriptOutlined from "@mui/icons-material/JavascriptOutlined";
import DataObjectOutlined from "@mui/icons-material/DataObjectOutlined";
import HtmlOutlined from "@mui/icons-material/HtmlOutlined";
import CssOutlined from "@mui/icons-material/CssOutlined";

/* file icon resolver */
const getFileIcon = (name) => {
    if (name.endsWith(".js")) return <JavascriptOutlined />;
    if (name.endsWith(".json")) return <DataObjectOutlined />;
    if (name.endsWith(".html")) return <HtmlOutlined />;
    if (name.endsWith(".css")) return <CssOutlined />;
    return <InsertDriveFileOutlined />;
};

const FileTreeNode = ({ FileName, Node, OnSelect, Path }) => {
    const isDir = Node !== null;
    const [open, setOpen] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isDir) {
            setOpen(!open);
        } else {
            OnSelect(Path);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    borderRadius: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
                {isDir
                    ? open
                        ? <FolderOpenOutlined />
                        : <FolderOutlined />
                    : getFileIcon(FileName)}

                <span>{FileName}</span>
            </div>

            {isDir && open && (
                <ul style={{ listStyle: "none", paddingLeft: "16px" }}>
                    {Object.keys(Node).map((child) => (
                        <li key={child}>
                            <FileTreeNode
                                FileName={child}
                                Node={Node[child]}
                                Path={`${Path}/${child}`}
                                OnSelect={OnSelect}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FileTree = ({ tree, OnSelect }) => {
    return (
        <div>
            {Object.keys(tree).map((key) => (
                <FileTreeNode
                    key={key}
                    FileName={key}
                    Node={tree[key]}
                    Path={`/${key}`}
                    OnSelect={OnSelect}
                />
            ))}
        </div>
    );
};

export default FileTree;
