import './App.css'
import RegisterModal from './components/RegisterModal';
import NavBar from './components/Navbar'

const RegisterPage = () => {
    return (
        <>
            <div className="w-screen md:w-screen h-full flex flex-col" style={{
                backgroundImage: "url('/17580.jpg')", backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }} >
                <NavBar />
                <RegisterModal />
            </div>
        </>
    )
}

export default RegisterPage;
