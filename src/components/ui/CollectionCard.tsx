import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  count: string;
  image: string;
  category: string;
};

export function CollectionCard({ title, count, image, category }: Props) {
  return (
    <Link href={`/collections?cat=${category}`} className="collection-card">
      <Image
        src={image}
        alt={title}
        width={400}
        height={600}
        className="collection-card-img"
      />
      <div className="collection-card-overlay">
        <div className="collection-card-label">Collection</div>
        <h3 className="collection-card-title">{title}</h3>
        <div className="collection-card-count">{count} Handcrafted Pieces</div>
      </div>
    </Link>
  );
}
