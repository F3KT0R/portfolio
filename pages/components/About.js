import React from 'react';
import styles from '../../styles/modules/About.module.scss';
import Image from 'next/image ';
import optica from '../../public/optica.png';
import Link from 'next/link';

function About() {
  return (
    <div className={styles.container}>
        <div className={styles.text}>
            <span>&lt;h1&gt;</span><br />
            <h1>&nbsp;&nbsp;About me:</h1>
            <hr />
            <span>&lt;/h1&gt;</span><br /><br /><br /><br />
            <span>&lt;p&gt;</span><br />
            <p>I’m a <span>Medior Frontend Developer</span> with a strong focus on <span>Angular</span> working full time.</p>
            <p>I'm responsible for <span>maintaining software architecture</span> and <span>developing innovative solutions</span> tailored to company requirements.</p>
            <p>I've studied <span>Computer Sciences</span> at the <span>University of Szeged</span>.</p>
            <p>I was born in a small town in the Vojvodina region of Serbia which is called <span>Novi Bečej</span>.</p>
            <p>My mother tongue is <span>Hungarian</span>, but I can speak, read and write fluently <span>English</span> and <span>Serbian</span> also.</p>
            <p>I consider myself a <span>team player</span> because I'm really <span>communicative</span> and I'm <span>ready to learn</span> new skills thorugh work and experience.</p>
            <p>In my free time I do <span>Photography</span> and I play the <span>Piano</span> since I was little. I even have a Degree from Elementary Music School.</p>
            <br /><span>&lt;/p&gt;</span><br />
        </div>

        <div className={styles.side}>
          <a href={'https://www.instagram.com/_opticaphoto/'} target='_blank' rel="noopener noreferrer"><div className={styles.image_container}>
            <span>&lt;Image</span>
            <Image
                  src={optica}
                  alt='Portrait'
                  className={styles.image}
                  layout={'raw'}
              />
          <span>/&gt;</span><br /><br /><br />
        </div></a>
        <div className={styles.cv}>
          <span>&lt;button&gt;</span><br /><br /><br />
          <Link href="/api/download-cv">
            <button>Curriculum Vitae</button>
          </Link>
          <br /><br /><span>&lt;/button&gt;</span>
        </div>

      </div>
    </div>
  )
}

export default About
