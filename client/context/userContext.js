import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const UserContext = React.createContext();

axios.defaults.withCredentials = true;

// Use env variable here
const serverUrl = process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "");

export const UserContextProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // register user
  const registerUser = async (e) => {
    e.preventDefault();
    if (
      !userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
      toast.success("User registered successfully");
      setUserState({ name: "", email: "", password: "" });
      router.push("/login");
    } catch (error) {
      console.log("Error registering user", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // login user
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("User logged in successfully");
      setUserState({ email: "", password: "" });
      await getUser();
      router.push("/");
    } catch (error) {
      console.log("Error logging in user", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // user login status
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true,
      });
      loggedIn = !!res.data;
      setLoading(false);
      if (!loggedIn) router.push("/login");
    } catch (error) {
      console.log("Error getting login status", error);
    }
    return loggedIn;
  };

  // logout user
  const logoutUser = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/logout`, { withCredentials: true });
      toast.success("User logged out successfully");
      setUser({});
      router.push("/login");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // get user details
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/user`, {
        withCredentials: true,
      });
      setUser((prev) => ({ ...prev, ...res.data }));
      setLoading(false);
    } catch (error) {
      console.log("Error getting user details", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to get user");
    }
  };

  // update user details
  const updateUser = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });
      setUser((prev) => ({ ...prev, ...res.data }));
      toast.success("User updated successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error updating user", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // email verification
  const emailVerification = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/verify-email`,
        {},
        { withCredentials: true }
      );
      toast.success("Email verification sent successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error sending verification email", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  // verify user/email
  const verifyUser = async (token) => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/verify-user/${token}`,
        {},
        { withCredentials: true }
      );
      toast.success("User verified successfully");
      getUser();
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log("Error verifying user", error);
      toast.error(error.response?.data?.message || "Verification failed");
      setLoading(false);
    }
  };

  // forgot password email
  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success("Forgot password email sent successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error sending forgot password email", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  // reset password
  const resetPassword = async (token, password) => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      toast.success("Password reset successfully");
      setLoading(false);
      router.push("/login");
    } catch (error) {
      console.log("Error resetting password", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  // change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      await axios.patch(
        `${serverUrl}/api/v1/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password changed successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error changing password", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Change failed");
    }
  };

  // admin get all users
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/admin/users`, {
        withCredentials: true,
      });
      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting all users", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to get users");
    }
  };

  // dynamic input handler
  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;
    setUserState((prev) => ({ ...prev, [name]: value }));
  };

  // delete user
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/v1/admin/users/${id}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      setLoading(false);
      getAllUsers();
    } catch (error) {
      console.log("Error deleting user", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();
      if (isLoggedIn) {
        await getUser();
      }
    };
    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        emailVerification,
        verifyUser,
        forgotPasswordEmail,
        resetPassword,
        changePassword,
        allUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
