const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Define a route to get all notes
app.get('/api/notes.html', (req, res) => {
  try {
    // Read the notes from the db.json file
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
  } catch (error) {
    // Handle any errors, such as if the file doesn't exist
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
});
  
// Define a route to save a new note
app.post('/api/notes.html', (req, res) => {
  try {
    const newNote = req.body;
    // Read existing notes
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    // Assign a unique ID to the new note (you can use a library like uuid for this)
    newNote.id = generateUniqueId(); // Implement generateUniqueId() as needed
    // Add the new note to the list of notes
    notes.push(newNote);
    // Write the updated notes back to the db.json file
    fs.writeFileSync('db.json', JSON.stringify(notes));
    res.json(newNote);
  } catch (error) {
    // Handle any errors, such as file read/write errors
    res.status(500).json({ error: 'Failed to save the note' });
  }
});

// Define a route to delete a note
app.delete('/api/notes.html/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    // Read existing notes
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    // Find the index of the note with the given ID
    const index = notes.findIndex((note) => note.id === noteId);
    if (index !== -1) {
      // Remove the note from the array
      notes.splice(index, 1);
      // Write the updated notes back to the db.json file
      fs.writeFileSync('db.json', JSON.stringify(notes));
      res.json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    // Handle any errors, such as file read/write errors
    res.status(500).json({ error: 'Failed to delete the note' });
  }
});