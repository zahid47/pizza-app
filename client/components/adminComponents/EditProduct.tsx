import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../../utils/axios";

export default function EditProduct({ _product }: { _product: any }) {
  const [product, setProduct] = useState<any>(_product);

  const router = useRouter();

  const handleEditProduct = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    let data = new FormData();
    data.append("name", product.name);
    data.append("description", product.description);
    data.append("isVegan", product.isVegan);

    const accessToken = Cookies.get("accessToken");

    await axios.put(`/product/${product._id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // FIXME: re render (because of state change) instead of refreshing the page
    router.push("/admin");
  };

  return (
    <>
      <h1 className="text-danger">BREAKING - DO NOT EDIT</h1>
      <h3>Edit Product</h3>

      <Form encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            type="text"
            value={product.name}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            type="text"
            value={product.description}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            checked={product.isVegan}
            onChange={(e) => {
              setProduct({ ...product, isVegan: e.target.checked });
            }}
            type="checkbox"
            label="Vegan?"
          />
        </Form.Group>

        <Button onClick={handleEditProduct} variant="dark" type="submit">
          Edit Product
        </Button>
      </Form>
    </>
  );
}
