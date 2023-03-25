import React from 'react';
import styles from '../../styles/modules/Project.module.scss';
import Card from './Project_card';
import Data from '../data/project_data.json';

function Project() {
  return (
    <div className={styles.project}>
      <br />
      <span>&lt;h1&gt;</span>
      <br />
      <h1>&nbsp;&nbsp;Say hello to my projects:</h1>
      <hr />
      <span>&lt;/h1&gt;</span>
      <br />

      <div className={styles.container}>
        {Data &&
          Data.map(
            (
              { title, technologies, poster, link, github, description },
              index
            ) => {
              return (
                <Card
                  key={index}
                  title={title}
                  technologies={technologies}
                  poster={poster}
                  link={link}
                  github={github}
                  desc={description}
                />
              );
            }
          )}
      </div>
    </div>
  );
}

export default Project;
