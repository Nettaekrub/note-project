import './App.css'
import NavBar from './components/Navbar'
import AddNote from './AddNote'

const NotePage = () => {
    return (
        <>
            <div className="w-screen md:w-screen h-full flex flex-col" style={{
                backgroundImage: "url('/17580.jpg')", backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }} >
                <NavBar />
                <AddNote></AddNote>
            </div>
        </>
    )
}

export default NotePage;
