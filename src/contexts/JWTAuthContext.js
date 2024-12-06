import { createContext, useEffect, useReducer } from 'react';
// import axios from 'src/utils/axios';
import { verify } from 'src/utils/jwt';
import PropTypes from 'prop-types';
import useAxiosInterceptor from './Interceptor';
import { useNavigate } from 'react-router';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { axios } = useAxiosInterceptor();
  const navigate = useNavigate();


  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const setSession = (accessToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const initialize = async () => {
    try {
      const accessToken = window?.localStorage?.getItem('accessToken');
      // const refreshToken = window.localStorage.getItem('refreshToken');

      if (accessToken) {
        // Verify the access token
        try {
          const user = verify(accessToken); // Replace JWT_SECRET with your secret key
          // Token is valid, set session and dispatch user
          setSession(accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } catch (error) {
          console.error('Access token verification failed:', error);
        }
      } else {
        // setSession(null);
        // console.log('session set as null');
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
        // navigate('/account/LogOut');
      }
    } catch (err) {
      console.error(err);

      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
      // navigate('/account/LogOut');
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `/adminLogin`,
        {},
        {
          headers: {
            username: email,
            password: password,
            'Content-Type': 'application/json'
          }
        }
      );
      // console.log(response);
      // const { accessToken, user } = response.data;
      const user = response.data.token;
      const token = response.data.token;
      const fullRes = response.data;

   
      setSession(token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user
        }
      });
      return { success: true, user, fullRes };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return { success: false, token: null,error: error.response?.data };
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const register = async (email, name, password) => {
    const response = await axios.post('/api/account/register', {
      email,
      name,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
