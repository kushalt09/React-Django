import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null); // State to keep track of the note being edited

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateNote();
        } else {
            createNote();
        }
    };

    const createNote = () => {
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const updateNote = () => {
        api
            .put(`/api/notes/update/${editingId}/`, { title, content })
            .then((res) => {
                if (res.status === 200) alert("Note updated!");
                else alert("Failed to update note.");
                setEditingId(null);
                getNotes();
            })
            .catch((err) => {
                console.error('Error updating note:', err);
                alert("Error updating note: " + err.message);
            });
    };
    

    const startEditing = (note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} onEdit={() => startEditing(note)} key={note.id} />
                    
                ))}
            </div>
            <h2>{editingId ? 'Edit Note' : 'Create a Note'}</h2>
            <form onSubmit={handleNoteSubmit}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value={editingId ? 'Update' : 'Submit'}></input>
            </form>
        </div>
    );
}

export default Home;
