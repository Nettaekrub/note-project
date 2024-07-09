import React, { useState } from 'react';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-80 mx-auto'>
            <input
                type="email"
                value={email}
                className='mb-2 p-2 rounded-md'
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit" className='bg-black rounded-md text-white p-2 font-bold'>Request Password Reset</button>
        </form>
    );
};

export default ForgotPasswordForm;