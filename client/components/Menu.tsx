import { useEffect, useState } from "react";
import menuStyles from "../styles/Menu.module.css";
import MenuItem from "./MenuItem";

export default function Menu({ data }: { data: any }) {
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    setProducts(data);
  }, [data, products, setProducts]);

  return (
    <div className={menuStyles.container}>
      <div className={menuStyles.wrapper}>
        {products.map((product: any) => (
          <MenuItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
