import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import axios from "../../../utils/axios";
import styles from "../../../styles/Admin.add.module.css";

export default function Add() {
  const [product, setProduct] = useState<any>({
    isVegan: false,
    prices: [
      { price: 999999, option: "small" },
      { price: 999999, option: "medium" },
      { price: 999999, option: "large" },
    ],
  });
  const router = useRouter();

  const handleAddNewProduct = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", product.name);
    data.append("prices", JSON.stringify(product.prices));
    data.append("description", product.description);
    data.append("isVegan", product.isVegan);
    data.append("images", product.image);

    const accessToken = Cookies.get("accessToken");

    await axios.post("/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    router.push("/admin");
  };

  return (
    <div className={styles.container}>
      <form encType="multipart/form-data">
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          className={styles.input}
          type="text"
          id="name"
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          className={styles.input}
          id="description"
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        <label htmlFor="vegan" className={styles.label}>
          Vegan?
        </label>
        <input
          className={styles.input}
          type="checkbox"
          id="vegan"
          onChange={(e) =>
            setProduct({ ...product, isVegan: e.target.checked })
          }
        />

        <label htmlFor="images" className={styles.label}>
          Image
        </label>
        <input
          className={styles.input}
          type="file"
          id="images"
          accept="jpeg, jpg, png"
          // multiple
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const image: File = (target.files as FileList)[0];
            setProduct({ ...product, image });
          }}
        />

        <label htmlFor="prices" className={styles.label}>
          Prices
        </label>
        <div id="prices">
          <input
            className={styles.input}
            type="number"
            id="small"
            placeholder="small"
            onChange={(e) => {
              setProduct({
                ...product,
                prices: [
                  { price: e.target.value, option: "small" },
                  { price: product.prices[1].price, option: "medium" },
                  { price: product.prices[2].price, option: "large" },
                ],
              });
            }}
          />
          <input
            className={styles.input}
            type="number"
            id="medium"
            placeholder="medium"
            onChange={(e) => {
              setProduct({
                ...product,
                prices: [
                  { price: product.prices[0].price, option: "small" },
                  { price: e.target.value, option: "medium" },
                  { price: product.prices[2].price, option: "large" },
                ],
              });
            }}
          />
          <input
            className={styles.input}
            type="number"
            id="large"
            placeholder="large"
            onChange={(e) => {
              setProduct({
                ...product,
                prices: [
                  { price: product.prices[0].price, option: "small" },
                  { price: product.prices[1].price, option: "medium" },
                  { price: e.target.value, option: "large" },
                ],
              });
            }}
          />
        </div>

        <button className={styles.loginbtn} onClick={handleAddNewProduct}>
          Create new Product
        </button>
      </form>
    </div>
  );
}
