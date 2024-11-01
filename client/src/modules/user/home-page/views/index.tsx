import React from 'react';
import HeroCard from '../components/hero-card/hero-card';
import Brands from '../components/brands/brands';
import Featured from '../components/feaured/featured';
import Testimonials from '../components/testimonials/testimonials';
import DateChooser from '../components/date-chooser/date-chooser';
import styles from './index.module.css';


const Home = () => {
  return (
    <div className={styles.homePageWrapper}>
      <HeroCard />
      <DateChooser />
      <Brands />
      <Featured />
      <Testimonials />
    </div>
  )
}

export default Home;
