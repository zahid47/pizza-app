import styles from "../styles/Search.module.css";
import axios from "../utils/axios";
import { MouseEvent } from "react";

export default function Search({ search, setSearch, setProducts }: any) {
  const handleSearch = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!search) {
      const res = await axios.get(`/product?name=${search}`);
      const data = res.data;
      setProducts(data);
    } else {
      const res = await axios.get(`/product?name=${search}`);
      const data = res.data;
      setProducts(data);
    }
  };

  return (
    <div className={styles.container}>
      <form>
        <input
          className={styles.input}
          placeholder="Butterscotch"
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          className={styles.searchBtn}
          onClick={(e) => {
            handleSearch(e);
          }}
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
}
