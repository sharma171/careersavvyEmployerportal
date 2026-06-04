import { loginToAPI } from "../../services/AuthService";
import {
  formatError,
  // login,
  runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
} from "../../services/AuthService";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";
export const NAVTOGGLE = "NAVTOGGLE";

export function signupAction(email, password, firstName, lastName, username, country, navigate) {
  return async (dispatch) => {
    try {
      const response = await signUp(email, password, firstName, lastName, username, country);

      const data = await response.json(); // Parsing JSON response

      if (response.ok && data.token) {
        // Check if token exists to determine success
        saveTokenInLocalStorage(data); // Save the token data
        runLogoutTimer(dispatch, 3600 * 1000, navigate); // Assuming token is valid for 1 hour
        dispatch(loginConfirmedAction(data)); // Dispatch login success
        navigate("/dashboard"); // Navigate to dashboard on success
      } else {
        const errorMessage = formatError(data); // Handle error
        dispatch(signupFailedAction(errorMessage));
      }
    } catch (error) {
      const errorMessage = formatError(error.message);
      dispatch(signupFailedAction(errorMessage));
    }
  };
}

export function Logout(navigate) {
  localStorage.removeItem("userDetails");

  navigate("/login");

  return {
    type: LOGOUT_ACTION,
  };
}

export function loginAction(payload, navigate) {
  return (dispatch) => {
    loginToAPI(payload)
      .then((response) => {
        const data = response.data;
        if(data.password_change_required == true) {
          navigate(`/forgot-password?temp=true&email=${data.email}`);
          console.log(data.email);
          localStorage.setItem("resetPassword",data.email);
        }
        else{

          if (data.token) {
            saveTokenInLocalStorage(data); // Save the token data
            runLogoutTimer(dispatch, 3600 * 1000, navigate); // Assuming token is valid for 1 hour
            dispatch(loginConfirmedAction(data)); // Dispatch login success
            console.log(data);
            navigate("/dashboard"); // Navigate to dashboard on success
          } else {
            const errorMessage = formatError(data); // Handle error
            dispatch(loginFailedAction(errorMessage));
          }
        }
      })
      .catch((error) => {
        const errorMessage = formatError(error.response ? error.response.data : error.message);
        dispatch(loginFailedAction(errorMessage));
      });
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}

export const navtoggle = () => {
  return {
    type: "NAVTOGGLE",
  };
};
