import React from 'react'
import CustomScrollbar from '../CustomScrollbar'

const ContentLayout: React.FC<{ children: any }> = ({ children }) => {
    return (
        <CustomScrollbar>
        <div style={{
            padding: `10px 16px`, borderRadius: 4, display: 'flex',
            justifyContent: 'flex-start', flexWrap: 'wrap', overflow: 'auto',
            margin: 1
        }}>
            {children}
        </div>
        </CustomScrollbar>
    )
}

export default ContentLayout