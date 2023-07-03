import axios from './api';
import { useNavigate, Link } from "react-router-dom";
const API_URL = "/user";

const signup = (email, password) => {
  return axios
    .post(API_URL + "/user", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const login = (DS_EMAIL, CLIENT_SECRET) => {
  return axios
    .post(API_URL + "/login", {
        DS_EMAIL,
        CLIENT_SECRET,
    })
    .then((response) => {
      if (response.data.token) {
        
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  
  
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
