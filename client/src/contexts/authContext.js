import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    let navigate = useNavigate();

    const login = async (formData) => {
        try {
            const response = await axios.post('http://localhost:8000/users/login', formData);
            setCurrentUser(response.data.user);
            setIsGuest(false);
            const currentTime = new Date().getTime();
            const timeLeft = response.data.expiresAt - currentTime;
            if (timeLeft > 0) {
                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, timeLeft);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:8000/users/logout',);
            setCurrentUser(null);
            setIsGuest(false);
            console.log("userloggedout");
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    const continueAsGuest = () => {
        setCurrentUser(null);
        setIsGuest(true);
        navigate('/home');
    };



    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/loggedIn');
                setCurrentUser(response.data.user);
                setIsGuest(false);
                const currentTime = new Date().getTime();
                const timeLeft = response.data.expiresAt - currentTime;
                console.log((timeLeft/1000)/60);
                if (timeLeft > 0) {
                    setTimeout(() => {
                        logout();
                        navigate("/login");
                    }, timeLeft);
                } else {
                    logout();
                    navigate("/login");
                }

            } catch (error) {
                console.log('Not logged in');
            }
            setLoading(false);
        };

        verifyUser();

    }, []);

    const value = {
        currentUser,
        login,
        logout,
        isGuest,
        continueAsGuest
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};