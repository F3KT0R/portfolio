import React from 'react'
import styles from '../../styles/modules/Project.module.scss';
import Card from './Project_card';
import fort from '../../public/medieval_fort.png';
import watchflix from '../../public/watchflix.png';


function Project() {
  return (
    <div className={styles.project}>
      <br /><span>&lt;h1&gt;</span><br />
      <h1>&nbsp;&nbsp;Say hello to my projects:</h1>
      <hr />
      <span>&lt;/h1&gt;</span><br />
      
      <div className={styles.container}>
      <Card 
        title='Medieval Fort' 
        technologies={['HTML5', 'CSS3', 'ThreeJS', 'Blender', 'Netlify']} 
        poster={fort} 
        github='https://github.com/F3KT0R/middleagefort'
        link='https://middleagesfort.netlify.app/' 
        desc={"This was a project I've created for a course at University.\n The main 3D elements were created in Blender.\n The rest of the work was done in ThreeJS.\n It has been hosted on Netlify so it is made accessible to anyone.\n It has keyboard commands attached to it, but the explanation is written in Hungarian."}
      />
      <Card 
        title='Watchflix' 
        technologies={['HTML5', 'CSS3', 'React', 'TMDB API', 'Netlify']} 
        poster={watchflix} 
        link='https://watchflix-webapp.netlify.app' 
        github='https://github.com/F3KT0R/watchflix'
        desc={"This was my Graduation Thesis at the University of Szeged.\n It is a Progressive Web Application developed by me in ReactJS.\n Uses data from The Movie Database's API service.\n It's hosted on Netlify. \n It is installable, works offline and is responsive as well."}
      />
      </div>
    </div>
  )
}

export default Project