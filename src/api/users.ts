// // src/api/users.ts
// import axios from "axios";

// const API_URL = "http://localhost:5000/users"; // change if needed

// export const signupUser = async (userData: {
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
// }) => {
//   return await axios.post(`${API_URL}/signup`, userData);
// };

// export const loginUser = async (credentials: {
//   email: string;
//   password: string;
// }) => {
//   return await axios.post(`${API_URL}/login`, credentials);
// };

// export const getUsers = async () => {
//   return await axios.get(`${API_URL}`);
// };

// export const getUserById = async (id: string) => {
//   return await axios.get(`${API_URL}/${id}`);
// };

// export const deleteUser = async (id: string) => {
//   return await axios.delete(`${API_URL}/${id}`);
// };
