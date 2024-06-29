import axios from 'axios'; //api shooter

const API_URL = 'http://localhost:8000/api/notes';

export const fetchNotes = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createNote = async (noteData) => {
    try {
        const response = await axios.post(API_URL, noteData);
        return response.data;
    } catch (error) {
        // Handle error
        console.error('Failed to create note:', error);
        throw new Error('Failed to create note');
    }
}

export const deleteNote = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`)
        console.log('Deleted note!');
    } catch (error) {
        console.error(`Error deleting note: ${ API_URL }/${id}`, error);
    }
};

export const editNote = async (id, updatedNote) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedNote);
        return response.data;
    } catch (error) {
        console.error('Error updating note:', error);
        throw new Error('Failed to update note');
    }
};
