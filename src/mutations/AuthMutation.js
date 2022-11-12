import axios from "axios";

const loginMutation = (data) =>
  axios.post("api/auth/login", data).then((resp) => resp.data);
const signUpMutation = (data) =>
  axios.post("api/auth/register", data).then((resp) => resp.data);

export { loginMutation, signUpMutation };
