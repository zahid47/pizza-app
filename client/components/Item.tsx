import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Item.module.css";

const Item = ({ item }: any) => {
  return (
    <Link href={`/products/${item._id}`}>
      <div className={styles.container}>
        <Image
          src={item.images[0]}
          alt={item.name}
          width="200"
          height="200"
          priority
        />
        <h1 className={styles.title}>{item.name}</h1>
        <p className={styles.desc}>{item.description}</p>
        <span className={styles.price}>${item.prices[0].price}</span>
      </div>
    </Link>
  );
};

export default Item;
