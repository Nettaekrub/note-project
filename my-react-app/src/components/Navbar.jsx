import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin as Hamburger } from 'hamburger-react'
import Modal from './Modal';
import { VscCheck } from "react-icons/vsc";


function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open_fill, setOpen_fill] = useState(false);

    const toggleButt = () => {
        setIsOpen(!isOpen);
        console.log(isOpen)
    };

    const checkLogin = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            setIsLoggedIn(!isLoggedIn);
        } catch (e) {
            return console.log(e.message);
        }
    }

    const logOutButton = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            setOpen_fill(!open_fill);
        }, 500);
    }

    const refreshPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    useEffect(() => { 
        checkLogin();
    }, []); 
   

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
                        {isLoggedIn && <li>
                            <Link to="/notes" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Notes</Link>
                        </li>}
                        <li>
                            <Link to="/services" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Services</Link>
                        </li>
                        {isLoggedIn ? <li>
                            <button onClick={logOutButton} className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Logout</button>
                        </li> 
                        : <li>
                            <Link to="/login" className="text-white hover:bg-gray-600 transition duration-500 hover:rounded-md rounded-md inline-block px-4 py-2">Login</Link>
                        </li>}
                    </ul>
                    </div>
                <Modal open={open_fill} isFill={true} onClose={() => setOpenFill(false)} >
                    <div className="flex justify-center">
                        <VscCheck size={108} className='text-red-500 absolute top-7 ' />
                        <p className="text-xl font-semibold mt-16">Logout Successfully!</p>
                        <button onClick={refreshPage} className='absolute bottom-4 left-26 border-2 border-solid bg-stone-900 p-2 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>OK</button>
                    </div>
                </Modal>
                </div>

            {isOpen ? (<ul className="md:hidden flex flex-col text-sm space-y-4 font-bold mt-4 z-40">
                        <li className='py-3'>
                            <Link to="/" className="text-white">Home</Link>
                        </li>
                        {isLoggedIn && <li className='py-3'>
                            <Link to="/notes" className="text-white">Notes</Link>
                        </li>}
                        <li className='py-3'>
                            <Link to="/services" className="text-white">Services</Link>
                        </li>
                        {isLoggedIn ? <li className='py-3'>
                            <button onClick={logOutButton} className="text-white ">Logout</button>
                        </li>
                        : <li className='py-3'>
                            <Link to="/login" className="text-white">Login</Link>
                        </li>}
                    </ul>
                    ) : null}
        </nav>
    );
}

export default NavBar;
