import React,{useState} from 'react';
import axios from 'axios';
import { signupErrors } from '../helpers';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onContinueAsGuest, onLogin, registerUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      password2: ''
  });
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState(false);
  const [password2, setPassword2] = useState(false);
  const handleSubmit = async (event) => {
    console.log("abc");
    event.preventDefault();
  
    if(Object.keys(signupErrors(formData)).length === 0){
      try{
        await axios.post('http://localhost:8000/users/register', formData);
        navigate('/login');

      } catch(error){
        if(error.response.status === 400){

          setErrors(error.response.data);
          console.log(errors);
        }
      }
    } else {
      setErrors(signupErrors(formData));
    }
  };

  const togglePassword = () => {
    setPassword(!password);
};

const togglePassword2 = () => {
    setPassword2(!password2);
};

  return (
    <div className="welcome-container">
      <h1>Welcome to Fake StackOverflow</h1>
      <div className="login-signup-container">
        <h2>Sign Up</h2>

        <input type="text" placeholder="Username" onChange = {e => setFormData({...formData, username: e.target.value })} />
        {errors.username && <div className="error">{errors.username}</div>}

        <input type="text" placeholder="Email" onChange = {e => setFormData({...formData, email: e.target.value })}/>
        {errors.email && <div className="error">{errors.email}</div>}

        <div className="input-container">
          <input type={password ? "text" : "password"} placeholder="Password" onChange = {e => setFormData({...formData, password: e.target.value })}/>
          <img src={password ? '../visible.png' : '../invisible.png'} onClick={togglePassword} className="toggle-icon" alt="Toggle " />
        </div>
        {errors.password && <div className="error">{errors.password}</div>}

        <div className="input-container">
          <input type={password2 ? "text" : "password"}  placeholder="Confirm Password" onChange = {e => setFormData({...formData, password2: e.target.value })}/>
          <img src={password2 ? '../visible.png' : '../invisible.png'} onClick={togglePassword2} className="toggle-icon" alt="Toggle " />
        </div>
        {errors.password2 && <div className="error">{errors.password2}</div>}

        <button className='c' onClick={handleSubmit}>Sign Up</button>
        <div className="extra-buttons">
          <button className='a' onClick={onContinueAsGuest}>Continue as Guest</button>
          <button className = 'b' onClick={onLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}