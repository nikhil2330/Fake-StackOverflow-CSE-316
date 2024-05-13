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
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8000/users/${userId}`);

                setUsers(users.filter(user => user._id !== userId)); 
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    return (
        <div className='admin-body'>
            <h1 className='admin'>Admin Dashboard</h1>
            <ul className='user'>
                {users.map(user => (
                    <li key={user._id}>
                        <div className='userDeets'  onClick={() => navigate(`/home/profile/${user._id}`)}>
                        <span className='user-admin-name'>{user.username}</span>   --- <span className='user-email'>{user.email}</span>  <span className='user-time'> Member Since {getTimeStamp(user.join_date_time)}</span><span className='userreputation'>  Reputation:  {user.reputation}</span>
                        </div>
                        <button className = "delete-user"onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;