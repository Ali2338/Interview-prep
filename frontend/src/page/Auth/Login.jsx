import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-md mx-auto p-6 sm:p-8 flex flex-col justify-center">
      <h3 className="text-lg sm:text-xl font-semibold text-black">Welcome back</h3>
      <p className="text-xs sm:text-sm text-slate-700 mt-1 mb-6">
        Enter your details to log in
      </p>

      <form onSubmit={handleLogin} className="space-y-3">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="Enter your email address"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Minimum 8 characters"
          type="password"
        />

        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

        <button type="submit" className="btn-primary w-full py-2 sm:py-2.5">
          Login
        </button>

        <p className="text-sm sm:text-base text-slate-800 mt-3 text-center">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('signup')}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
