import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { FaCircleXmark } from "react-icons/fa6";
import { VscCheck } from "react-icons/vsc";



function RegisterModal({ }) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [open_fill, setOpenFill] = useState(false);

    const updateIsOpen = () => {
        const screenWidth = window.innerWidth;
        const breakpoint = 840;
        setIsOpen(screenWidth >= breakpoint)
    }

    useEffect(() => {
        updateIsOpen();

        const handleResize = () => {
            updateIsOpen(); // Update isOpen on window resize
        };

        window.addEventListener('resize', handleResize); // Add event listener for window resize

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up event listener on component unmount
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/register', { email, password });
            setMessage("Created successfully!");
            return;

        } catch (error) {
            setMessage(error.response.data.message);
            console.log(message);
            return;
        }
    };


    return (
        <div className='fixed inset-0 flex justify-center items-center z-10'>
            <div className='relative bg-gradient-to-r from-gray-300 to-white bg-opacity-50 rounded-xl shadow-md w-5/6  md:w-4/6 z-0'>
                <div className="flex flex-col m-6 bg-white border-2 bg-opacity-50 shadow-md rounded-xl">
                    <p className="mt-8 text-xl font-bold text-gray-700 text-center">Register</p>
                    <form className="px-4 py-6" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-base font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-base font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-12'>
                            <label htmlFor='confirmPassword' className='block text-base font-medium text-gray-700'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                id='confirmPassword'
                                className='mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm'
                                placeholder='Confirm your password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={() => setOpenFill(true)}
                            className="mb-6 w-full py-2 px-4 border border-transparent rounded-md bg-stone-900 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-102 duration-500 shadow-md"
                        >
                            Sign Up
                        </button>
                        <div className='mt-2 flex-col md:flex-row flex justify-center gap-2'>
                            <p className="text-base font-medium text-gray-700 text-center">Have an account already?</p>
                            <a className='text-base text-center hover:underline font-bold text-gray-700 cursor-pointer'>Login</a>
                        </div>
                    </form>
                    {message !== "Created successfully!" && <Modal open={open_fill} isFill={true} onClose={() => setOpenFill(false)} >
                        <div className="flex justify-center">
                            <FaCircleXmark size={108} className='text-red-500 absolute top-7 ' />
                            <p className="text-xl font-semibold absolute bottom-20">{message}</p>
                            <button className='absolute bottom-4 left-26 border-2 border-solid bg-stone-900 p-2 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>OK</button>
                        </div>
                    </Modal>}
                    {message === "Created successfully!" && <Modal open={open_fill} isFill={true} onClose={() => setOpenFill(false)} >
                        <div className="flex justify-center">
                            <VscCheck size={108} className='text-red-500 absolute top-7 ' />
                            <p className="text-xl font-semibold absolute bottom-20">{message}</p>
                            <button className='absolute bottom-4 left-26 border-2 border-solid bg-stone-900 p-2 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>OK</button>
                        </div>
                    </Modal>}
                </div>
            </div>
        </div>

    )
}

export default RegisterModal;
