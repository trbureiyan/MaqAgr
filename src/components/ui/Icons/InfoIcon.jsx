import React from 'react';

const InfoIcon = ({ size = 'default', className = '', color = 'currentColor' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-5 h-5',
        large: 'w-6 h-6'
    };

    const finalSize = sizeClasses[size] || sizeClasses.default;

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${finalSize} ${className}`} 
            viewBox="0 0 24 24" 
            fill={color}
        >
            {/* Google Material Icon (round-info)*/}
            <path 
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1-8h-2V7h2z"
            />
        </svg>
    );
};

export default InfoIcon;
