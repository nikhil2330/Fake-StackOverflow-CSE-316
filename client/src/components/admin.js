import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getTimeStamp } from '../helpers';



const Admin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users'); 
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        console.log(userId);
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                console.log(userId);
                await axios.delete(`http://localhost:8000/users/${userId}`);

                setUsers(users.filter(user => user._id !== userId)); 
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };
    console.log(users);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <div className='userDeets'  onClick={() => navigate(`/home/profile/${user._id}`)}>
                        <span>{user.username}</span>   --- <span>{user.email}</span>  <span> Member Since {getTimeStamp(user.join_date_time)}</span><span>  Reputation:  {user.reputation}</span>
                        </div>
                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;