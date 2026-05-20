import React from 'react';

const ProfileIcon = ({ size = 'default', className = '', color = 'currentColor' }) => {
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
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
            />
        </svg>
    );
};

ProfileIcon.displayName = 'ProfileIcon';

export default ProfileIcon;
