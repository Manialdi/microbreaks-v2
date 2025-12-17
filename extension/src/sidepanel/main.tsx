import React from 'react'
import ReactDOM from 'react-dom/client'
import SidePanel from './SidePanel'
import '../index.css' // Reuse global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SidePanel />
    </React.StrictMode>,
)
