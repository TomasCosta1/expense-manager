import React from 'react';
import './styles.css';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FaceIcon from '@mui/icons-material/Face';

const Header = () => {
    return (
        <header className='header'>
            <h1>Expense Manager</h1>
            <div>
                <SettingsIcon style={{ cursor: 'pointer', marginRight: '20px' }} />
                <NotificationsNoneIcon style={{ cursor: 'pointer', marginRight: '20px' }} />
                <FaceIcon style={{ cursor: 'pointer', marginRight: '20px' }} />
            </div>
        </header>
    );
};

export default Header;