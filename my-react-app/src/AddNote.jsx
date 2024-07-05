import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import NoteModal from './components/NoteModal';
import { VscWarning } from "react-icons/vsc";
import { FaCircleXmark } from "react-icons/fa6";
import { fetchNotes, createNote, deleteNote, editNote} from './api';

function Title({ value, onChange }) {
    return (
        <div className='h-16 w-100 items-center flex justify-center mt-3'>
            <input className='border-2 px-2 py-5 h-12 sm:w-5/12 w-7/12 hover:w-9/12 sm:hover:w-6/12 rounded-md shadow-md hover:bg-gray-100 duration-700 cursor-pointer focus:border-transparent focus:outline-none ' 
            type="text" 
            value={value}
            onChange={onChange}
            placeholder="Enter Title" />
        </div>
    );
}

function NoteBox({ value, onChange }) {
    return (
        <div className='h-96 w-screen items-center flex justify-center'>
            <textarea
                className='border-2 px-2 h-96 w-9/12 sm:w-6/12 rounded-md shadow-md hover:bg-gray-100 duration-700 cursor-pointer focus:border-transparent focus:outline-none'
                type="text"
                style={{ minHeight: '300px', resize: 'none' }}
                value={value}
                placeholder="Write Your Note.."
                onChange={onChange}
            />
        </div>
    );
}


function AddNote() {
    const [notes, setNotes] = useState([]);
    const [noteText, setNoteText] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [open_fill, setOpenFill] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editId, setEditId] = useState('');

    useEffect(() => { // async await เพื่อให้ คำสั่งอื่นใน program ทำต่อไปได้
        const getNotes = async () => {
            const notes = await fetchNotes(); // จบการทำงานก็ให้ปิด async func ทิ้ง
            setNotes(notes);
        };
        getNotes();
    }, []); // บอกมันว่าทำแค่ครั้งเดียว

    const addNote = async () => {
        if (noteText.trim() === '' || noteTitle.trim() === '') {
            setOpenFill(true); 
            return;
        }

        try {
            const newNote = await createNote({ title: noteTitle.trim(), content: noteText });
            setNotes([...notes, newNote]);
            setNoteTitle('');
            setNoteText('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleEdit = async (id, title_val, content_val) => {
        console.log(id, title_val, content_val);
        if (title_val.trim() === '' || content_val.trim() === '') {
            setOpenFill(true);
            console.log("Kuy")
            return;
        }

        try {
            const editedNote = { title: title_val, content: content_val };
            await editNote(id, editedNote);
            console.log(`Saved!! ${id}`);
            setTimeout(() => {
                window.location.reload();   
            }, 500);
        } catch (error) {
            console.error('Failed to save note:', error);
        }

    }

    const editButtOpener = (id, title, content) => {
        setEditId(id);
        setOpenEdit(true);
        setEditTitle(title);
        setEditContent(content);
    }

    const handleTitleChange = (event) => {
        setNoteTitle(event.target.value); // Update the noteText state with the current value of the textarea
    };

    const handleNoteChange = (event) => {
        setNoteText(event.target.value); // Update the noteText state with the current value of the textarea
    };

    const handleEditTitle = (event) => {
        setEditTitle(event.target.value); // Update the noteText state with the current value of the textarea
    };

    const handleEditNote = (event) => {
        setEditContent(event.target.value); // Update the noteText state with the current value of the textarea
    };

    const delNote = async (id) => {
        try {
            await deleteNote(id);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };



    return (
        <div>
            <Title value={noteTitle} onChange={handleTitleChange}></Title>
            <NoteBox value={noteText} onChange={handleNoteChange} />
            <div className='h-20 w-full items-center flex justify-center'>
                <button onClick={addNote} className='border-2 px-2 h-12 w-36 rounded-md shadow-md bg-stone-900 hover:w-40 hover:h-16 text-white hover:text-black hover:bg-gray-100 duration-700 cursor-pointer focus:border-transparent focus:outline-none font-bold '>
                    Add your note
                </button>
                <Modal open={open_fill} isFill={true} onClose={() => setOpenFill(false)} >
                    <div className="flex justify-center">
                        <FaCircleXmark size={108} className='text-red-500 absolute top-7 ' />
                        <p className="text-xl font-semibold mt-10">Fill the title and note correctly.</p>
                        <button className='absolute bottom-4 left-26 border-2 border-solid bg-stone-900 p-2 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>OK</button>
                    </div>
                </Modal>
            </div>
            

            <div className="mx-4 my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {notes.map((a) => (
                    <div key={a.id} className="bg-gray-200 rounded-md p-4 sm:h-96 h-80 shadow-md relative">
                        <div className="font-bold flex">{a.title}</div>
                        {a.content}
                        <button onClick={() => editButtOpener(a.id, a.title, a.content)} className='absolute bottom-5 right-24 border-2 border-solid bg-stone-900 px-3 py-1 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>Edit</button>
                        <NoteModal open={openEdit} 
                            onClose={() => setOpenEdit(false)} >
                            <input className='absolute top-8 border-2 px-2 h-14 sm:w-96 w-64 rounded-md shadow-md hover:bg-gray-100 duration-700 cursor-pointer focus:border-transparent focus:outline-none '
                                type="text"
                                value={editTitle}
                                onChange={handleEditTitle}
                            />
                            <textarea className='absolute top-28 border-2 px-2 w-5/6 rounded-md shadow-md hover:bg-gray-100 duration-700 cursor-pointer focus:border-transparent focus:outline-none h-60 sm:h-80' 
                                style={{ resize: 'none' }}
                                value={editContent} 
                                onChange={handleEditNote}
                            />
                            <button onClick={() => setOpenEdit(false)} className='absolute bottom-8 right-36 md:right-40 border-2 border-solid bg-stone-900 p-3 px-6 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>Cancel</button>
                            <button onClick={() => handleEdit(editId, editTitle, editContent)} className='absolute bottom-8 right-10 md:right-14 border-2 border-solid bg-stone-900 p-3 px-7 rounded-md text-white font-semibold hover:bg-green-500 transform hover:scale-110 duration-500 shadow-md'>Save</button>
                        </NoteModal>
                        <button onClick={() => setOpen(true)} className='absolute bottom-5 right-4 border-2 border-solid bg-stone-900 px-3 py-1 rounded-md text-white font-semibold hover:bg-red-500 transform hover:scale-110 duration-500 shadow-md'>Delete</button>
                        <Modal open={open} isFill={false} onClose={() => setOpen(false)}>
                            <div className="flex justify-center">
                                <VscWarning size={150} className='text-red-500 absolute top-4 md:text-sm' />
                            </div>
                            <br></br>
                            <br></br>
                            <p className="text-base sm:text-xl font-semibold mt-8 sm:mt-0">Are you sure to delete this note?</p>
                            <button className='absolute bottom-6 sm:bottom-10 left-10 sm:left-20 border-2 border-solid bg-stone-900 p-2 sm:p-3 px-8 sm:px-16 rounded-md text-white font-semibold hover:text-black hover:bg-white transform hover:scale-110 duration-500 shadow-md'>Cancel</button>
                            <button onClick={() => delNote(a.id)} className='absolute bottom-6 sm:bottom-10 right-10 sm:right-20 border-2 border-solid bg-stone-900 p-2 sm:p-3 px-8 sm:px-16 rounded-md text-white font-semibold hover:bg-red-500 transform hover:scale-110 duration-500 shadow-md'>Delete</button>
                        </Modal>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddNote;
