import { Router } from 'express';
const router = Router();
//import { findOneAndUpdate } from '../models/users.js';
import * as UserController from '../controllers/users.js'

// Get all users
router.get('/', UserController.findAll);

/*
// Get one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Create or update a user (Upsert)
router.post('/', async (req, res) => {
  const { name, email, url } = req.body;

  try {
    const user = await findOneAndUpdate(
      { email: email }, // Criteria to find the document
      { name: name, email: email, url: url }, // Data to update
      { new: true, upsert: true } // Options: return the updated doc and upsert if not found
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.url != null) {
    res.user.url = req.body.url;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.deleteOne(); // Using deleteOne instead of remove
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get user object by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

*/
export default router;