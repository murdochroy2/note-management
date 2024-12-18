const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// Add this function
async function getUserTeams(userId) {
  try {
    const teams = await Team.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    });
    return teams.map(team => team._id);
  } catch (error) {
    console.error('Error getting user teams:', error);
    return [];
  }
}

// Get all notes for user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ 
      $or: [
        { owner: req.user.userId },
        { team: { $in: await getUserTeams(req.user.userId) } }
      ]
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, teamId } = req.body;
    
    const note = new Note({
      title,
      content,
      category,
      owner: req.user.userId,
      team: teamId
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    let note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    // Check ownership
    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 