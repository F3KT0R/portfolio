import React from 'react'
import styles from '../../styles/modules/Project.module.scss';
import Card from './Project_card';
import { projects_data } from '../data/data'


function Project() {
  return (
    <div className={styles.project}>
      <br /><span>&lt;h1&gt;</span><br />
      <h1>&nbsp;&nbsp;Say hello to my projects:</h1>
      <hr />
      <span>&lt;/h1&gt;</span><br />
      
      <div className={styles.container}>
        {projects_data.map(({title, technologies, poster, link, github, description}, index) => {
          return(
            <Card 
              key={index}
              title={title}
              technologies={technologies}
              poster={poster} 
              link={link}
              github={github}
              desc={description}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Project