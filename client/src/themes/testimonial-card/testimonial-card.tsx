import { TestimonialProps } from '@/interfaces/testimonials';
import React from 'react';
import styles from './testimonial-card.module.css'

const TestimonialCard: React.FC<TestimonialProps> = ({ name , position , feedback ,imageUrl, rating }) => {
    const stars = Array.from({ length: 5 }, (_, index) => 
        index < rating ? '★' : '☆'
    );

    return (
        <div className={styles.card}>
            <img src={imageUrl} alt={`${name}'s photo`} className={styles.image} />
            <div className={styles.rating}>
                {stars.map((star, index) => (
                    <span key={index} className={styles.star}>{star}</span>
                ))}
            </div>
            <p className={styles.feedback}>"{feedback}"</p>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.position}>{position}</p>
        </div>
    );
}
  export default TestimonialCard;