import React,{useState} from 'react';
import { loginErrors } from '../helpers';
import axios from 'axios';

export default function Login({ onContinueAsGuest, onSignUp, loginUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if(Object.keys(loginErrors(formData)).length === 0){
      try{
        await axios.post('http://localhost:8000/users/login', formData);
        loginUser();
      } catch(error){
        if(error.response.status === 401){
          setErrors(error.response.data);
          console.log(errors);
        }
      }
    } else {
      setErrors(loginErrors(formData));
    }
  };

  return (
    <div className="welcome-container">
        <h1>Welcome to Fake StackOverflow</h1>
        <div className="login-signup-container">
            <h2>Login</h2>
            <input type="text" placeholder="Email" onChange = {e => setFormData({...formData, email: e.target.value })}/>
            {errors.email && <div className="error">{errors.email}</div>}

            <input type="password" placeholder="Password" onChange = {e => setFormData({...formData, password: e.target.value })}/>
            {errors.password && <div className="error">{errors.password}</div>}
            <button className='c' onClick={handleSubmit}>Login</button>
            <div className="extra-buttons">
                <button className='a' onClick={onContinueAsGuest}>Continue as Guest</button>
                <button className = 'b' onClick={onSignUp}>Sign Up</button>
            </div>
        </div>
    </div>
  );
}