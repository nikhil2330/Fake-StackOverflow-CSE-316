import React,{useState} from 'react';
import { loginErrors } from '../helpers';
import { useAuth } from '../contexts/authContext.js';
import { useNavigate } from 'react-router-dom';

export default function Login({ onContinueAsGuest, onSignUp, loginUser }) {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [password, setPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if(Object.keys(loginErrors(formData)).length === 0){
      try{
        await login(formData);
        navigate('/home');
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
  const togglePassword = () => {
    setPassword(!password);
};

  return (
    <div className="welcome-container">
        <h1>Welcome to Fake StackOverflow</h1>
        <div className="login-signup-container">
            <h2>Login</h2>
            <input type="text" placeholder="Email" onChange = {e => setFormData({...formData, email: e.target.value })}/>
            {errors.email && <div className="error">{errors.email}</div>}

            <div className="input-container">
              <input type={password ? "text" : "password"} placeholder="Password" onChange = {e => setFormData({...formData, password: e.target.value })}/>
              <img src={password ? '../visible.png' : '../invisible.png'} onClick={togglePassword} className="toggle-icon" alt="Toggle " />
            </div>
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