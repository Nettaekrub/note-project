import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react'


function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleButt = () => {
        setIsOpen(!isOpen);
        console.log(isOpen)
    };

    return (
        <nav className="bg-black p-3 rounded-b-md shadow-md z-50">
            <div className="flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold" >
                    Nettae
                </Link>
                <div className='md:hidden'>
                    <Hamburger size={26} color="white" toggled={isOpen} toggle={toggleButt} />
                </div>
                <div className={"hidden md:flex flex-grow justify-end"}>
                    <ul className="flex text-sm space-x-8 font-bold">
                        <li>
                            <Link to="/" className="text-white hover:bg-gray-700 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Home</Link>
                        </li>
                        <li>
                            <Link to="/notes" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Notes</Link>
                        </li>
                        <li>
                            <Link to="/services" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Services</Link>
                        </li>
                        <li>
                            <Link to="/login" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Login</Link>
                        </li>
                    </ul>
                    </div>
                </div>

            {isOpen ? (<ul className="md:hidden flex flex-col text-sm space-y-4 font-bold mt-4 z-40">
                        <li className='py-3'>
                            <Link to="/" className="text-white">Home</Link>
                        </li>
                        <li className='py-3'>
                            <Link to="/notes" className="text-white">Notes</Link>
                        </li>
                        <li className='py-3'>
                            <Link to="/services" className="text-white">Services</Link>
                        </li>
                        <li className='py-3'>
                            <Link to="/login" className="text-white">Login</Link>
                        </li>
                    </ul>
                    ) : null}
        </nav>
    );
}

export default NavBar;
