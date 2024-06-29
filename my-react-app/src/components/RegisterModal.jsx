import React, { useState, useEffect } from 'react';

function RegisterModal({ }) {
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <div className='fixed inset-0 flex justify-center items-center z-10'>
            <div className='relative bg-gradient-to-r from-gray-300 to-white bg-opacity-50 rounded-xl shadow-md w-5/6  md:w-4/6 z-0'>
                <div className="flex flex-col m-6 bg-white border-2 bg-opacity-50 shadow-md rounded-xl">
                    <p className="mt-8 text-xl font-bold text-gray-700 text-center">Register</p>
                    <form className="px-4 py-6">
                        <div className="mb-8">
                            <label htmlFor="email" className="block text-base font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Enter your email"
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
                            />
                        </div>
                        <div className="mb-12">
                            <label htmlFor="password" className="block text-base font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mb-6 w-full py-2 px-4 border border-transparent rounded-md bg-stone-900 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-102 duration-500 shadow-md"
                        >
                            Sign Up
                        </button>
                        <div className='mt-2 flex-col md:flex-row flex justify-center gap-2'>
                            <p className="text-base font-medium text-gray-700 text-center">Have an account already?</p>
                            <a className='text-base text-center hover:underline font-bold text-gray-700 cursor-pointer'>Login</a>
                        </div>


                    </form>
                </div>
                {/*  {isOpen && (
                    <div className="m-6 border-2 bg-opacity-50 shadow-md rounded-xl">
                        <p>Kuy rai ISUS</p>
                    </div>
                )} */}
            </div>
        </div>

    )
}

export default RegisterModal;
