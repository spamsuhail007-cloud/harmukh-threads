export const dynamic = 'force-dynamic';

import { getProductsWithReviews } from '@/actions/reviews';
import { ReviewsClient } from './ReviewsClient';

export default async function ReviewsPage() {
  const products = await getProductsWithReviews();

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="section-title">Manage Reviews</h1>
          <p className="section-subtitle">Create and manage customer reviews for your products</p>
        </div>
      </div>

      <ReviewsClient products={products} />
    </>
  );
}
