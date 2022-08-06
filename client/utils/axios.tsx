import axios from "axios";
const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`;

export default axios.create({
  baseURL,
});
