import React from 'react'
import styles from '../../styles/modules/Project.module.scss';
import Card from './Project_card';
import fort from '../../public/medieval_fort.png';
import watchflix from '../../public/watchflix.png';
import portfolio from '../../public/portfolio.png';
import tax_calculator from '../../public/tax-calculator.png';


function Project() {
  return (
    <div className={styles.project}>
      <br /><span>&lt;h1&gt;</span><br />
      <h1>&nbsp;&nbsp;Say hello to my projects:</h1>
      <hr />
      <span>&lt;/h1&gt;</span><br />
      
      <div className={styles.container}>
      <Card 
        title='Portfolio Website' 
        technologies={['Next.js', 'Sass', 'React Components', 'Web Design', 'Netlify']} 
        poster={portfolio} 
        link='https://tibor-balint.netlify.app/' 
        github='https://github.com/F3KT0R/portfolio'
        desc={"It's obviously this website which is a representation of my work.\n This is the first time I've used Next.js.\n Created my own design using Adobe Photoshop.\n It's hosted on Netlify. \n Constantly being updated as I create more and more projects and learn new things."}
      />
      <Card 
        title='Income Tax Calculator' 
        technologies={['React.js', 'TailwindCSS', 'Webpack', 'Web Design', 'Netlify']} 
        poster={tax_calculator} 
        link='https://net-income.netlify.app/' 
        github='https://github.com/F3KT0R/tax-calculator'
        desc={"This was the first project that I've created from scratch without CRA.\n It is a Webpack bundled project using Yarn as a package manager hosted on Netlify.\n Adding my own small local JSON data and creating custom utility components.\n The design of the site was influenced by a template project, but the current look is uniquely designed by me in Adobe Photoshop. \n This is also the first project that I've used TailwindCSS with."}
      />
      <Card 
        title='Watchflix' 
        technologies={['HTML5', 'CSS3', 'React', 'TMDB API', 'Netlify']} 
        poster={watchflix} 
        link='https://watchflix-webapp.netlify.app' 
        github='https://github.com/F3KT0R/watchflix'
        desc={"This was my Graduation Thesis at the University of Szeged.\n It is a Progressive Web Application developed by me in ReactJS.\n Uses data from The Movie Database's API service.\n It's hosted on Netlify. \n It is installable, works offline and is responsive as well."}
      />
      <Card 
        title='Medieval Fort' 
        technologies={['HTML5', 'CSS3', 'ThreeJS', 'Blender', 'Netlify']} 
        poster={fort} 
        github='https://github.com/F3KT0R/middleagefort'
        link='https://middleagesfort.netlify.app/' 
        desc={"This was a project I've created for a course at University.\n The main 3D elements were created in Blender.\n The rest of the work was done in ThreeJS.\n It has been hosted on Netlify so it is made accessible to anyone.\n It has keyboard commands attached to it, but the explanation is written in Hungarian."}
      />
      </div>
    </div>
  )
}

export default Project