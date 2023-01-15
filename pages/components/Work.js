import React from 'react';
import Card from './Work_card';
import styles from '../../styles/modules/Work.module.scss';
import { experience_data } from '../data/data';

function Work() {
  return (
    <div className={styles.work}>
      <br /><span>&lt;h1&gt;</span><br />
      <h1>&nbsp;&nbsp;Where have I worked?</h1>
      <hr />
      <span>&lt;/h1&gt;</span><br />
      
      <div className={styles.container}>
      {experience_data.map(({title, year, role, address, link, description}, index) => {
        return (
          <Card 
            key={index}
            title={title} 
            year={year}
            role={role} 
            address={address} 
            link={link} 
            description={description}
          />
        )
      })}
      </div>
    </div>
  )
}

export default Work