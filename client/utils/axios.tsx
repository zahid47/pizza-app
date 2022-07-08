import axios from "axios";
const baseURL = "http://localhost:8000/api/v1";

export default axios.create({
  baseURL,
});
