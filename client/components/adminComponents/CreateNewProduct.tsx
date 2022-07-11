import Cookies from "js-cookie";
import { MouseEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "../../utils/axios";

export default function CreateNewProduct() {
  const [product, setProduct] = useState<any>({
    prices: [
      {
        price: 300,
        option: "small",
      },
      {
        price: 500,
        option: "medium",
      },
      {
        price: 700,
        option: "large",
      },
    ],
    isVegan: false,
  });

  const handleAddNewProduct = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    let data = new FormData();
    data.append("name", product.name);
    data.append("description", product.description);
    data.append("isVegan", product.isVegan);
    data.append("prices", JSON.stringify(product.prices));
    data.append("images", product.image);

    const accessToken = Cookies.get("accessToken");
    const savedProduct = await axios.post("/product", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(savedProduct);
    alert("Product created");
  };

  return (
    <>
      <h3>Add New Products</h3>

      <Form encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            type="text"
            placeholder="Enter Pizza Name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            type="text"
            placeholder="Enter a small Description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            accept="jpg,png,jpeg"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              const image: File = (target.files as FileList)[0];
              setProduct({
                ...product,
                image,
              });
            }}
          />
        </Form.Group>

        {/* FIXME: prices */}
        <Form.Group className="mb-3">
          <Form.Label>Prices</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="number"
              aria-label="small"
              placeholder="small"
              onChange={(e) => {
                setProduct({
                  ...product,
                  prices: [
                    ...product.prices,
                    { price: e.target.value, option: "medium" },
                  ],
                });
              }}
            />
            <Form.Control
              type="number"
              aria-label="medium"
              placeholder="medium"
              onChange={(e) =>
                setProduct({
                  ...product,
                  prices: [
                    ...product.prices,
                    { price: e.target.value, option: "medium" },
                  ],
                })
              }
            />
            <Form.Control
              type="number"
              aria-label="large"
              placeholder="large"
              onChange={(e) =>
                setProduct({
                  ...product,
                  prices: [
                    ...product.prices,
                    { price: e.target.value, option: "large" },
                  ],
                })
              }
            />
          </InputGroup>
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

        <Button onClick={handleAddNewProduct} variant="dark" type="submit">
          Add Product
        </Button>
      </Form>
    </>
  );
}
