import React, { useRef, useEffect } from 'react';
import Image from 'next/future/image';
import {DiCss3, DiHtml5, DiReact, DiJavascript, DiSass, DiScrum, DiVisualstudio, DiPhotoshop, DiNpm, DiJira, DiGoogleDrive, DiGithubBadge, DiChrome} from 'react-icons/di';
import {SiNetlify} from 'react-icons/si';
import portrait from '../../public/OPT_3084.png';
import styles from '../../styles/modules/Main.module.scss';

function Main() {
  const graph = useRef(null);

  useEffect(() => {
    const ciclegraph = graph.current;
    const circleElements = ciclegraph.childNodes;

    let angle = 200;
    let dangle = 360 / circleElements.length;

    for (let i = 0; i < circleElements.length; i++) {
      let circle = circleElements[i];
      angle += dangle;
      circle.style.transform = `rotate(${angle}deg) translate(${dangle /
        1.5}em) rotate(-${angle}deg)`;
    }
  }, []);
  
  return (
    <div className={styles.main}>
      <div>
        <Image 
          src={portrait}
          alt='Portrait'
          className={styles.image}
          layout={'raw'}
        />

        <div className={styles.circlegraph} ref={graph}>
          <DiHtml5 className={styles.circle}/>
          <DiCss3 className={styles.circle}/>
          <DiSass className={styles.circle}/>
          <DiJavascript className={styles.circle}/>
          <DiReact className={styles.circle}/>
          <DiScrum className={styles.circle}/>
          <DiVisualstudio className={styles.circle}/>
          <DiPhotoshop className={styles.circle}/>
          <DiNpm className={styles.circle}/>
          <DiJira className={styles.circle}/>
          <DiGoogleDrive className={styles.circle}/>
          <DiGithubBadge className={styles.circle}/>
          <DiChrome className={styles.circle}/>
          <SiNetlify className={styles.circle}/>
        </div>
      </div>
      <div>
        <h1><span>&lt;h1&gt;</span><br />&nbsp;&nbsp;Hello World!<br /><span>&lt;/h1&gt;</span></h1>
        <hr />
        <h3><span>&lt;p&gt;</span><br />&nbsp;&nbsp; A junior web developer <br />&nbsp;&nbsp; and welcome to my story... <br /><span>&lt;/p&gt;</span></h3>
      </div>      
    </div>
  )
}

export default Main