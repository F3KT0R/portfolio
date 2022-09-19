import React from 'react'
import {ImInstagram, ImLinkedin, ImFacebook2, ImGithub} from 'react-icons/im';
import styles from '../../styles/modules/Contact.module.scss';

function Contact() {
  return (
    <div className={styles.contact}>
        <div className={styles.wrapper}>
            <h1>Find me on social media:</h1>
            <hr />
            <div className={styles.icons}>
                <div>
                    <a href={'https://www.instagram.com/tibii_b/'} target='_blank' rel="noopener noreferrer"><ImInstagram className={styles.icon}/></a>
                </div>
                <div>
                    <a href={'https://www.linkedin.com/in/tibor-b%C3%A1lint-a30a11205/'} target='_blank' rel="noopener noreferrer"><ImLinkedin className={styles.icon}/></a>
                </div>
                <div>
                    <a href={'https://www.facebook.com/tibor.balint.13/'} target='_blank' rel="noopener noreferrer"><ImFacebook2 className={styles.icon}/></a>
                </div>
                <div>
                    <a href={'https://github.com/F3KT0R'} target='_blank' rel="noopener noreferrer"><ImGithub className={styles.icon}/></a>
                </div>
            </div>
        </div>
        <div className={styles.wrapper}>
            <h1>Or contact me:</h1>
            <hr />
            <div className={styles.action}>
                <div>
                    <a href={'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=balinttibornb@gmail.com'} target='_blank' rel="noopener noreferrer"><button>Email me!</button></a>
                </div>
                <div>
                    <a href={'tel:+381606310599'}><button>Call me!</button></a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact