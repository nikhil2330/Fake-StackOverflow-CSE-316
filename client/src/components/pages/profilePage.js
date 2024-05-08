import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [content, setContent] = useState('questions');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const fetchUserDetails = async () => {
        const { data } = await axios.get('/api/user/details');
        setUser(data);
    };
    const fetchContent = async () => {
        const questions = await axios.get('http://localhost:8000/questions');
        setQuestions(questions.data);
        const answers = await axios.get('http://localhost:8000/questions');
        setAnswersQuestions(tags.data);
        const tags = await axios.get('http://localhost:8000/tags');
        setTags(tags.data);
    };
    useEffect(() => {
        // Fetch user details
        
        fetchUserDetails();

        // Fetch user content
       
        fetchContent();
    }, []);





};