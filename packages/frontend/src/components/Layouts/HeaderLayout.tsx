import { Paper, SxProps, Theme } from '@mui/material'
import React from 'react'

const HeaderLayout: React.FC<{ children: any, sx?: SxProps<Theme> }> = ({ children, sx }) => {
    return (
        <Paper sx={{
            height: "67px",
            borderRadius: "unset", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            padding: "0 20px",
            ...sx
        }}>
            {children}
        </Paper>
    )
}

export default HeaderLayout