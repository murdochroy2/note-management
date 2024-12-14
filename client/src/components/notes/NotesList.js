import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Fab,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NoteDialog from './NoteDialog';
import { useAuth } from '../../context/AuthContext';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = () => {
    setSelectedNote(null);
    setOpenDialog(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setOpenDialog(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedNote) {
        const response = await api.put(`/notes/${selectedNote._id}`, noteData);
        setNotes(notes.map(note => 
          note._id === selectedNote._id ? response.data : note
        ));
      } else {
        const response = await api.post('/notes', noteData);
        setNotes([response.data, ...notes]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Notes
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {note.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {note.content}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => handleEditNote(note)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteNote(note._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNote}
        >
          <AddIcon />
        </Fab>

        <NoteDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveNote}
          note={selectedNote}
        />
      </Box>
    </Box>
  );
};

export default NotesList; 