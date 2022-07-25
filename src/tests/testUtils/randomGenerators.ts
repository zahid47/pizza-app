import { faker } from "@faker-js/faker";
import { sample } from "lodash";
import { calculateTotal } from "../../services/order.service";
import { createProduct } from "../../services/product.service";
import { createUser } from "../../services/user.service";
import productSerializer from "../../utils/productSerializer";

export const generateRandomUser = (role?: "admin") => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    address: {
      addressLine: faker.address.streetAddress(),
      zip: faker.address.zipCode(),
      comment: faker.lorem.sentence(),
    },
    role: role,
  };
};

export const generateRandomProduct = () => {
  const prices = [
    {
      price: Math.floor(Math.random() * 2000),
      option: "small",
    },
    {
      price: Math.floor(Math.random() * 2000),
      option: "medium",
    },
    {
      price: Math.floor(Math.random() * 2000),
      option: "large",
    },
  ];

  return {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    ingredients: `
    ${faker.lorem.words(2)},
    ${faker.lorem.words(2)},
    ${faker.lorem.words(2)},
    ${faker.lorem.words(2)},
    ${faker.lorem.words(2)}`,
    category: faker.commerce.department(),
    isVegan: sample(["true", "false"]),
    prices: JSON.stringify(prices),
    extraIngredients: [
      {
        name: faker.commerce.productName(),
        price: Math.floor(Math.random() * 500),
      },
      {
        name: faker.commerce.productName(),
        price: Math.floor(Math.random() * 500),
      },
    ],
    tags: `
    ${faker.commerce.productAdjective()},
    ${faker.commerce.productAdjective()},
    ${faker.commerce.productAdjective()},
    ${faker.commerce.productAdjective()},
    ${faker.commerce.productAdjective()}`,
  };
};

//generate 3 random img urls
export const generateRandomImgURLs = () => {
  return [
    faker.image.imageUrl(),
    faker.image.imageUrl(),
    faker.image.imageUrl(),
  ];
};

export const generateRandomOrder = async (user?: any) => {
  const userId = user._id || (await createUser(generateRandomUser()))._id;

  const product1 = await createProduct(
    productSerializer(generateRandomProduct(), generateRandomImgURLs())
  );
  const product2 = await createProduct(
    productSerializer(generateRandomProduct(), generateRandomImgURLs())
  );

  const products = [
    {
      product: product1._id,
      variant: "small",
      quantity: 2,
    },
    {
      product: product2._id,
      variant: "large",
      quantity: 1,
    },
  ];

  return {
    products,
    payment: {
      method: "card",
    },
    total: await calculateTotal(products),
    user: userId,
  };
};
