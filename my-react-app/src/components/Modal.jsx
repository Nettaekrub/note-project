function Modal({open, onClose, isFill, children}) {
    return (
        <div
            onClick={onClose}
            className={`flex rounded-md justify-center items-center fixed inset-0 transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
            style={{ zIndex: open ? 9999 : -1 }}>
            <div className={`relative bg-white rounded-xl shadow-md sm:py-24 sm:px-24 transition-all duration-300 ${isFill ? "px-28 py-28 ": "px-12 py-20"  } ${open ? " opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                {children}
            </div>
        </div>
    )
}

export default Modal
