import './App.css'
import LoginModal from './components/LoginModal';
import NavBar from './components/Navbar'

const LoginPage = () => {
    return (
        <>
            <div className="w-screen md:w-screen h-full flex flex-col" style={{
                backgroundImage: "url('/17580.jpg')", backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center" }} >
                <NavBar />
                <LoginModal />
            </div>
        </>
    )
}

export default LoginPage;
