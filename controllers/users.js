
import User from '../models/users.js'

function exemplo1(argumento) {
  console.log(argumento);
}

const exemplo2 = (argumento) => {
  console.log(argumento);
}

export const findAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const findOneAndUpdate = async (req, res) => {
  const { name, email, url } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email: email }, // Criteria to find the document
      { name: name, email: email, url: url }, // Data to update
      { new: true, upsert: true } // Options: return the updated doc and upsert if not found
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
