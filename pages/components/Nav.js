import React, { useState } from 'react';
import Image from 'next/future/image';
import styles from '../../styles/modules/Nav.module.scss';
import logo_black from '../../public/logo-black.png';
import logo_white from '../../public/logo-white.png';
import { IoGridOutline } from 'react-icons/io5';

function Nav() {
    const [theme, setTheme] = useState(true);

    const handleClick = () => {
        setTheme(!theme);
        };

    return (
        <>
            <nav className={styles.nav}>
                <Image 
                    src={theme == true ? logo_white : logo_black}
                    alt='F3'
                    className={styles.image}
                    onClick={() => handleClick()}
                    layout={'raw'}
                />

                <IoGridOutline className={styles.menu_icon}/>
                <ul className={styles.navlist}>
                    <li>About Me</li>
                    <li>Experience</li>
                    <li>Projects</li>
                    <li>Contact</li>
                </ul>
            </nav>
            <div className={styles.fade_bottom} />
        </>
    )
}

export default Nav