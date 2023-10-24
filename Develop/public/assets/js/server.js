// Define a route to get all notes
app.get('/api/notes', (req, res) => {
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
  app.post('/api/notes', (req, res) => {
    // Implement code to save a new note to db.json
  });
  
  // Define a route to delete a note
  app.delete('/api/notes/:id', (req, res) => {
    // Implement code to delete a note by ID
  });