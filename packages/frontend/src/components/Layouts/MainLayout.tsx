import React from 'react'

const MainLayout : React.FC<{ children: any }> = ({ children }) => {
  return (
    <main style={{ width: 500, height: '100%', marginLeft: 60, display: 'flex', flexDirection: 'column' }}>
        {children}
    </main>
  )
}

export default MainLayout