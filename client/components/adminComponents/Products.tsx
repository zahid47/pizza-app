import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import axios from "../../utils/axios";

export default function ProductsTable({ products }: { products: any }) {
  const router = useRouter();

  const handleEdit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    router.push(`/admin/products/edit/${id}`);
  };

  const handleDelete = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    id: string
  ) => {
    e.preventDefault();

    const accessToken = Cookies.get("accessToken");
    axios.delete(`product/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    router.push("/admin");
  };

  return (
    <>
      <label>
        <h3>Products</h3>
      </label>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: any) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>
                <button
                  onClick={(e) => handleEdit(e, product._id)}
                  type="button"
                  className="btn btn-dark btn-sm"
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => handleDelete(e, product._id)}
                  type="button"
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
