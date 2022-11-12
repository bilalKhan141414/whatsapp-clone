import axios from "axios";
import { UserDto } from "../../dtos/UserDto";

// eslint-disable-next-line import/no-anonymous-default-export
class LocalStorageManager {
  localStorageKey = "userChatApp";
  get userChatData() {
    return localStorage.getItem(this.localStorageKey);
  }
  get IsUserLoggedIn() {
    return this.userChatData && !!JSON.parse(this.userChatData)?.accessToken;
  }
  get AuthToken() {
    return JSON.parse(this.userChatData)?.accessToken;
  }
  get User() {
    return new UserDto(this.userChatData && JSON.parse(this.userChatData).user);
  }
  set UserData(data) {
    if (data) {
      axios.defaults.headers.common["Authorization"] = data.accessToken;
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      return;
    }
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem(this.localStorageKey);
  }
}

export const localStorageHelpers = new LocalStorageManager();
