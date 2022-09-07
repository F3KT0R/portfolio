import React from 'react';
import styles from '../../styles/modules/Footer.module.scss';

function Footer() {
  

  return (
    <div className={styles.footer}>
      <p className={styles.text}>
        Designed &amp; developed by: F3
        &nbsp;&nbsp;<span>|</span>&nbsp;&nbsp;Using  <a href='https://nextjs.org/docs'>Next.JS</a> in conjunction with <a href='https://sass-lang.com/guide'>Sass</a>.
      </p>
    </div>
  )
}

export default Footer