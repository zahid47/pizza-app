import { GetServerSideProps } from "next";
import axios from "../../utils/axios";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import useCartStore from "../../context/cartStore";
import styles from "../../styles/Singleitem.module.css";

export default function SingleProduct({ product }: any) {
  const [option, setOption] = useState<"small" | "medium" | "large">("small");
  const { addToCart } = useCartStore((state) => state);

  const handleAddToCart = (
    _e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const orderedProduct = {
      id: product._id,
      name: product.name,
      price: product.prices.filter((p: any) => p.option === option)[0].price,
      option: option,
      quantity: 1,
    };
    addToCart(orderedProduct);
    alert("Added to cart");
  };

  return (
    <div className={styles.container}>
      <Image
        src={product.images[0]}
        alt={product.name}
        width={500}
        height={500}
      />
      <div className={styles.info}>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.desc}>{product.description}</p>
        <p className={styles.desc}>
          {product.isVegan ? <>Vegan</> : <>Non-Vegan</>}
        </p>
        {/* FIXME: dont hardcode the options */}
        <div onChange={(e: any) => setOption(e.target.value)}>
          <input type="radio" name="option" value="small" defaultChecked />{" "}
          <span className={styles.options}>Small</span>
          <input type="radio" name="option" value="medium" />{" "}
          <span className={styles.options}>Medium</span>
          <input type="radio" name="option" value="large" />{" "}
          <span className={styles.options}>Large</span>
        </div>
        <p className={styles.price}>
          ${product.prices.filter((p: any) => p.option === option)[0].price}
        </p>
        <button
          className={styles.addToCartBtn}
          onClick={(e) => {
            handleAddToCart(e);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const productId = params?.id;

  const res = await axios.get(`/product/${productId}`);
  const product = res.data;

  return {
    props: {
      product,
    },
  };
};
