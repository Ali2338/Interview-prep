import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';

    if (!username) {
      setError('Username is required');
      return;
    }
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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        console.log("📸 Image Upload Response:", imgUploadRes);
        profileImageUrl = imgUploadRes.imageUrl || '';
        console.log("✅ Final Image URL:", profileImageUrl); 
        
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: username,
        email,
        password,
        profilePicture: profileImageUrl, 
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
      <h3 className="text-lg sm:text-xl font-semibold text-black">Create an account</h3>
      <p className="text-xs sm:text-sm text-slate-700 mt-1 mb-6">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignUp} className="space-y-3">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          label="Username"
          placeholder="Enter your name"
          type="text"
        />

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
          Sign Up
        </button>

        <p className="text-sm sm:text-base text-slate-800 mt-3 text-center">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
