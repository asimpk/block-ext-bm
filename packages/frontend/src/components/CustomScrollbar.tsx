import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const CustomScrollbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const renderThumb = ({ style, ...props }: { style: React.CSSProperties }) => {
        const thumbStyle = {
            backgroundColor: '#888', // Change this to your desired handle color
            borderRadius: '4px', // Change this to your desired handle border radius
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };
    return (
        <Scrollbars
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
        >
            {children}
        </Scrollbars>
    )
}

export default CustomScrollbar