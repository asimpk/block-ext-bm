import { Paper, SxProps, Theme } from '@mui/material'
import React from 'react'

const HeaderLayout: React.FC<{ children: any, sx?: SxProps<Theme> }> = ({ children, sx }) => {
    return (
        <Paper sx={{ padding: `10px 20px 10px 20px`, ...sx }}>
            {children}
        </Paper>
    )
}

export default HeaderLayout