"use client";

import React, { useState } from 'react';
import styles from './testimonials.module.css';

import TestimonialCard from '@/themes/testimonial-card/testimonial-card';
import { testimonials } from '../../../../../../public/data/testimonials';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Number of visible testimonials per slide
    const visibleTestimonials = 3;

    // Ensure we don't scroll past the last set of testimonials
    const nextTestimonial = () => {
        if (currentIndex + visibleTestimonials < testimonials.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Loop back to start
        }
    };

    const prevTestimonial = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(testimonials.length - visibleTestimonials); // Loop back to last set
        }
    };

    return (
        <div className={styles.sliderWrapper}>
            <h2>What our clients say</h2>
            <div className={styles.sliderContent}>
                <div
                    className={styles.testimonialGrid}
                    style={{
                        transform: `translateX(-${(currentIndex / testimonials.length) * 100}%)`, // Adjust for smooth sliding
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            name={testimonial.name}
                            position={testimonial.position}
                            feedback={testimonial.feedback}
                            imageUrl={testimonial.imageUrl}
                            rating={testimonial.rating}  // Dynamic rating
                        />
                    ))}
                </div>
            </div>
            <div className={styles.navigation}>
                <button onClick={prevTestimonial} className={styles.navButton}>
                    ❮
                </button>
                <button onClick={nextTestimonial} className={styles.navButton}>
                    ❯
                </button>
            </div>
        </div>
    );
};

export default Testimonials;
