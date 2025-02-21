import React from 'react';
import Link from 'next/link';
import Image from 'next/image ';
import styles from '../../styles/modules/Nav.module.scss';
import logo_white from '../../public/logo-white.png';

function Nav() {
       return (
        <>
            <nav className={styles.nav}>
                <Image
                    src={logo_white}
                    alt='F3'
                    className={styles.image}
                    layout={'raw'}
                />

                <ul className={styles.navlist}>
                    <Link href='/#home'><li>Home</li></Link>
                    <Link href='/#about'><li>About Me</li></Link>
                    <Link href='/#experience'><li>Experience</li></Link>
                    <Link href='/#project'><li>Projects</li></Link>
                    <Link href='/#contact'><li>Contact</li></Link>
                </ul>
            </nav>
            <div className={styles.fade_bottom} />
        </>
    )
}

export default Nav
