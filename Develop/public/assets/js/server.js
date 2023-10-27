const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  return uuidv4();
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Catch-all route that serves the index.html file for any other URL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function generateUniqueId() {
  // Generate a random number between 0 and 9999 (you can adjust the range as needed)
  const randomPart = Math.floor(Math.random() * 10000);

  // Get the current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Combine the timestamp and random number to create a unique ID
  const uniqueId = `${timestamp}-${randomPart}`;

  return uniqueId;
}

// Define a route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);
      res.json(notes);
    }
  });
});

// Define a route to save a new note
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db.json'), (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);
      const newNote = req.body;

      // Generate a unique ID for the new note
      newNote.id = generateUniqueId(); // Implement the generateUniqueId function

      // Add the new note to the array of notes
      notes.push(newNote);

      // Write the updated notes array back to db.json
      fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to save the note' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

// Define a route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db.json'), (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);

      // Find the index of the note to delete
      const index = notes.findIndex((note) => note.id === noteId);

      if (index !== -1) {
        // Remove the note with the given ID
        notes.splice(index, 1);

        // Write the updated notes array back to db.json
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes), (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to delete the note' });
          } else {
            res.json({ message: 'Note deleted successfully' });
          }
        });
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    }
  });
});