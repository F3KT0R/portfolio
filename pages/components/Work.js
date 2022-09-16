import React from 'react';
import Card from './Work_card';
import styles from '../../styles/modules/Work.module.scss';

function Work() {
  return (
    <div className={styles.work}>
      <br /><span>&lt;h1&gt;</span><br />
      <h1>&nbsp;&nbsp;Where have I worked?</h1>
      <br /><span>&lt;/h1&gt;</span><br />
      <hr />
      
      <div className={styles.container}>

      <Card 
        title={'Bemeding'} 
        year={'August 2020 & August 2021'}
        role={'Webshop Administrator'} 
        address={'Serbia, Novi Bečej, Maršala Tita Street 10'} 
        link={'https://www.webapoteka.rs/'} 
        desc={'Managing the webshop\n Fulfilling orders\n Packaging and sending orders\n Customer Support'}
      />
      <Card 
        title={'Ovation BBDO'} 
        year={'1st July 2020 - 1st June 2022'} 
        role={'Translator / Social Media Manager'} 
        address={'Serbia, Belgrade, Velisava Vulovića Street 16'} 
        link={'https://ovation.rs/en/'} 
        desc={'Translation of advertisement content from English to Hungarian\n Community Management\n Writing reports and summing up monthly metrics\n Technical Support'}
      /> 
      <Card 
        title={'Zeto EU Kft'} 
        year={'1st October 2021 - 1st September 2022'} 
        role={'Quality Assurance Engineeer'} 
        address={'Hungary, Szeged, Back Bernát Street 6'} 
        link={'https://zeto-inc.com/'} 
        desc={`Internship for 4 months as a: Quality Assurance Intern\n Creating Custom Functions in Google Apps Script\n Testing and Validation of Custom Functions\n Key Performance Indicators Manager`}
      /> 
      </div>
    </div>
  )
}

export default Work