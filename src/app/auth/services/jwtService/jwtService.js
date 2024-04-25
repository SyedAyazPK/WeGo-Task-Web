import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
import jwtServiceConfig from "./jwtServiceConfig";
const { REACT_APP_API_URL } = process.env;

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", err.response.data.message);
            this.setSession(null);
          }
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", err.response.data.message);
            this.setSession(null);
          }
          if (
            err.response.status === 500 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("showError", "Not Found");
            // this.setSession(null);
          }
          if (
            err.response.status === 404 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            console.log(err, "err");
            this.emit("showError", err.response.data.message);
            // this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post(`${REACT_APP_API_URL}/user/create`, data).then((response) => {
        if (response.data.result) {
          this.setSession(response.data.token);
          resolve(response.data.result);
          this.emit("onLogin", response.data.result);
        } else {
          reject(response.statusText);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${REACT_APP_API_URL}/user/login`, {
          email,
          password,
        })
        .then((response) => {
          if (response.data.result) {
            this.setSession(response.data.token);

            resolve(response.data.result);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);

            this.emit("onLogin", response.data.result);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    const email = window.localStorage.getItem("email");
    const password = window.localStorage.getItem("password");
    return new Promise((resolve, reject) => {
      axios
        .post(`${REACT_APP_API_URL}/user/login`, {
          email,
          password,
        })
        .then((response) => {
          if (response.data.result) {
            this.setSession(response.data.token);

            resolve(response.data.result);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);

            this.emit("onLogin", response.data.result);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error("Failed to login with token."));
        });
    });
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem("token", access_token);
      // axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      axios.defaults.headers.common.token = `${access_token}`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("password");

      // delete axios.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.token;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit("onLogout", "Logged out");
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem("token");
  };
}

const instance = new JwtService();

export default instance;
