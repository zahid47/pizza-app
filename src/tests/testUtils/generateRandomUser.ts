import { faker } from "@faker-js/faker";

const generateRandomUser = () => {
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

export default generateRandomUser;
