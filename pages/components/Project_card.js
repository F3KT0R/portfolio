import React from 'react';
import Image from 'next/future/image';
import styles from '../../styles/modules/Project.module.scss';

function Project_card({title, technologies, poster, link, desc}) {
  return (
    <div className={styles.wrapper}>
        <span>&lt;div&gt;</span>

        <a href={link} target='_blank' rel="noopener noreferrer"><h1 className={styles.title}>
            {title}
        </h1></a>
        <a href={link} target='_blank' rel="noopener noreferrer"><Image 
          src={poster}
          alt={`Poster of ${title} project`}
          className={styles.image}
        /></a>
        <div className={styles.technologies}>{technologies != undefined ? technologies.map((line, idx) => <p key={idx}>{line}</p>) : ''}</div>
        
        <div className={styles.desc}>{desc != undefined ? desc.split('\n').map((line, idx) => <p key={idx}>{line}</p>) : ''}</div>
        <span>&lt;/div&gt;</span>

    </div>
  )
}

export default Project_card