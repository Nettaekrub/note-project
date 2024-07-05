import axios from "axios";
import { useState, useEffect } from "react";

function Test({}) {
    const [email, setEmail] = useState([]);
    const [status, setStatus] = useState("");

    const userData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, user is not logged in.');
                setStatus('No token found, user is not logged in.');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEmail(response.data.email);
            setStatus('User data fetched successfully.');
        } catch (error) {
            console.log('Error fetching user data:', error);
            setStatus('Error fetching user data.');
        }
    };

    useEffect(() => {
        userData();
    }, []);

    return (
        <div>
            <p>Status: {status}</p>
            <p>Emails: {email}</p>
        </div>
    )
}

export default Test;
