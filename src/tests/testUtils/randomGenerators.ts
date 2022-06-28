import { faker } from "@faker-js/faker";
import { sample } from "lodash";

export const generateRandomUser = () => {
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
  };
};

export const generateRandomProduct = () => {
  const name = faker.commerce.productName();

  return {
    name,
    slug: name.replaceAll(" ", "-"),
    description: faker.lorem.sentence(),
    images: [
      faker.image.imageUrl(24, 24, "food"),
      faker.image.imageUrl(24, 24, "food"),
    ],
    ingredients: [
      faker.lorem.words(2),
      faker.lorem.words(2),
      faker.lorem.words(2),
      faker.lorem.words(2),
      faker.lorem.words(2),
    ],
    category: faker.commerce.department(),
    isVegan: sample([true, false]),
    prices: [
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
    ],
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
    tags: [
      faker.commerce.productAdjective(),
      faker.commerce.productAdjective(),
      faker.commerce.productAdjective(),
      faker.commerce.productAdjective(),
      faker.commerce.productAdjective(),
    ],
  };
};
