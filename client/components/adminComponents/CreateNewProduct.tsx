import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "../../utils/axios";

export default function CreateNewProduct() {
  const [product, setProduct] = useState<any>({
    isVegan: false,
    prices: [
      { price: 99999, option: "small" },
      { price: 99999, option: "medium" },
      { price: 99999, option: "large" },
    ],
  });

  const router = useRouter();

  const handleAddNewProduct = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    let data = new FormData();
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
    // FIXME: re render (because of state change) instead of refreshing the page
    router.push("/admin");
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
                    { price: e.target.value, option: "small" },
                    { price: product.prices[1].price, option: "medium" },
                    { price: product.prices[2].price, option: "large" },
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
                    { price: product.prices[0].price, option: "small" },
                    { price: e.target.value, option: "medium" },
                    { price: product.prices[2].price, option: "large" },
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
                    { price: product.prices[0].price, option: "small" },
                    { price: product.prices[1].price, option: "medium" },
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
