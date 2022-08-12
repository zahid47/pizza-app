import styles from "../styles/Items.module.css";
import Item from "./Item";
import React from "react";

const Items = ({ data }: any) => {
  return (
    <div className={styles.container}>
      {!data.length ? (
        <p>No products found</p>
      ) : (
        <div className={styles.wrapper}>
          {data.map((item: any) => (
            <Item key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;
