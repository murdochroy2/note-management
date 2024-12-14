const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's teams
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { owner: req.user.userId },
        { members: req.user.userId }
      ]
    }).populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create team
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const team = new Team({
      name,
      owner: req.user.userId,
      members: [req.user.userId]
    });

    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { teams: team._id } }
    );

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite user to team
router.post('/:teamId/invite', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const team = await Team.findById(req.params.teamId);
    
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (team.members.includes(userToInvite._id)) {
      return res.status(400).json({ message: 'User already in team' });
    }

    team.members.push(userToInvite._id);
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(
      userToInvite._id,
      { $push: { teams: team._id } }
    );

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 