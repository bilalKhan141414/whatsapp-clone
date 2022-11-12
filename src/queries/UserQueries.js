import axios from "axios";

export const getUserDetails = () =>
  axios.get("api/user").then((resp) => resp.data);
