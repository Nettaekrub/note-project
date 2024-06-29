function NoteModal({ open, onClose, children}) {
    return (
        <div
            onClick={onClose}
            className={`flex rounded-md justify-center items-center fixed inset-0 transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
            style={{ zIndex: open ? 9999 : -1 }}>
            <div onClick={(e) => e.stopPropagation()} 
                className={`relative bg-white rounded-xl shadow-md sm:py-60 py-48 px-44 sm:px-60 md:px-80 transition-all duration-300 ${open ? " opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                <div className='h-16 w-100 items-center flex justify-center'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default NoteModal
