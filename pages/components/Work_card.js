import React from 'react';
import styles from '../../styles/modules/Work.module.scss';

function Work_card({title, year, role, address, link, desc}) {
  return (
    <div className={styles.wrapper}>
        <span>&lt;div&gt;</span>
        <a href={link} target='_blank' rel="noopener noreferrer"><h1 className={styles.title}>
            {title}
        </h1></a>
        <h3 className={styles.date}>{year}</h3>
        <h3 className={styles.text}>{role}</h3>
        <h3 className={styles.text}>{address}</h3>
        <div className={styles.desc}>{desc != undefined ? desc.split('\n').map((line, idx) => <p key={idx}>{line}</p>) : ''}</div>
        <span>&lt;div&gt;</span>
    </div>
  )
}

export default Work_card