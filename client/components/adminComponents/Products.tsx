import { MouseEvent } from "react";

export default function ProductsTable({ products }: { products: any }) {
  const handleEdit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    console.log("handleEdit");
  };

  const handleDelete = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    console.log("handleDelete");
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
                  onClick={handleEdit}
                  type="button"
                  className="btn btn-dark btn-sm"
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={handleDelete}
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
