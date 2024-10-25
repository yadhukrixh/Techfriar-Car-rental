"use client";
import React from "react";
import { Star } from "lucide-react";
import styles from "./user-review.module.css";

interface ReviewType {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  verified_purchase: boolean;
}

// Sample data with different ratings
const demoReviews: ReviewType[] = [
  {
    id: "1",
    user_name: "John Doe",
    rating: 5,
    review_text: "Excellent product, exceeded expectations!",
    verified_purchase: true,
  },
  {
    id: "2",
    user_name: "Jane Smith",
    rating: 4,
    review_text: "Very good product with minor issues",
    verified_purchase: true,
  },
  {
    id: "3",
    user_name: "Mike Johnson",
    rating: 3,
    review_text: "Average product, could be better",
    verified_purchase: true,
  },
  {
    id: "4",
    user_name: "Sarah Brown",
    rating: 5,
    review_text: "Perfect! Just what I needed",
    verified_purchase: true,
  },
  {
    id: "5",
    user_name: "Robert Wilson",
    rating: 2,
    review_text: "Not satisfied with the quality",
    verified_purchase: false,
  },
];

const calculateRatingStats = (reviews: ReviewType[]) => {
  const breakdown = Array(5).fill(0);
  let totalRating = 0;

  reviews.forEach((review) => {
    breakdown[review.rating - 1] += 1; // Adjusted to fill breakdown correctly
    totalRating += review.rating;
  });

  const averageRating = totalRating / reviews.length;
  return {
    breakdown,
    average: averageRating.toFixed(1),
    total: reviews.length,
  };
};

const RatingBar = ({ rating, count, total }: { rating: number; count: number; total: number }) => {
  const percentage = (count / total) * 100;

  return (
    <div className={styles.ratingBarContainer}>
      <span className={styles.ratingLabel}>{rating}★</span>
      <div className={styles.barWrapper}>
        <div
          className={styles.barFill}
          style={{ width: `${percentage}%`, backgroundColor: '#5e2ddc' }} // Ensure color is applied here
        />
      </div>
      <span className={styles.ratingCount}>{count}</span>
    </div>
  );
};

const ReviewComponent = () => {
  const { breakdown, average, total } = calculateRatingStats(demoReviews);

  return (
    <div className={styles.reviewSection}>
      <h2 className={styles.reviewTitle}>Customer Reviews</h2>

      <div className={styles.reviewStats}>
        <div className={styles.averageRating}>
          <span className={styles.ratingNumber}>{average}</span>
          <div className={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={index < Math.round(Number(average)) ? styles.starFilled : styles.starEmpty}
                size={24}
              />
            ))}
          </div>
          <span className={styles.totalReviews}>{total} ratings</span>
        </div>

        <div className={styles.ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={breakdown[index]}
              total={total}
            />
          ))}
        </div>
      </div>

      <div className={styles.reviewList}>
        {demoReviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h4>{review.user_name}</h4>
              {review.verified_purchase && (
                <span className={styles.verifiedTag}>Verified Purchase</span>
              )}
            </div>
            <div className={styles.reviewRating}>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={index < review.rating ? styles.starFilled : styles.starEmpty}
                  size={16}
                />
              ))}
            </div>
            <p className={styles.reviewText}>{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewComponent;
