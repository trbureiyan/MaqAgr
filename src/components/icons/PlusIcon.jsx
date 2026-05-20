import React from 'react';

const PlusIcon = ({ size = 'default', className = '', color = 'currentColor' }) => {
    const sizeClasses = {
        small: 'w-5 h-5',
        default: 'w-6 h-6',
        large: 'w-7 h-7'
    };

    const finalSize = sizeClasses[size] || sizeClasses.default;

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${finalSize} ${className}`} 
            viewBox="0 0 24 24" 
            fill={color}
        >
            <path 
                fillRule="evenodd" 
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" 
                clipRule="evenodd" 
            />
        </svg>
    );
};

export default PlusIcon;