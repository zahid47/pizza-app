import Image from "next/image";
import styles from "../styles/MenuItem.module.css";
import Link from "next/link";

const MenuItem = ({ product }: { product: any }) => {
  let img =
    "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg";
  if (product.image) {
    img = product.image[0];
  }

  return (
    <div className={styles.container}>
      <Link href={`/products/${product._id}`} passHref>
        <Image src={img} alt={product.name} width="500" height="500" />
      </Link>
      <h1 className={styles.title}>{product.name}</h1>
      <span className={styles.price}>${product.prices[0].price}</span>
      <p className={styles.desc}>{product.description}</p>
    </div>
  );
};

export default MenuItem;
