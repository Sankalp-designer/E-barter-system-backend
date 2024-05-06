import User from '../models/user.js';
import Product from '../models/product.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5h' } 
    );

    res.status(200).json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const profile = async (req, res) => {
  try {

    const userId = req.user.userId;

    const user = await User.findById(userId).populate({
      path: 'products',
      populate: {
        path: 'barterOffers.user',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      products: user.products,
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const user = req.user; 

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    await user.save();

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const user = req.user; 
    await user.remove();

    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userId = req.user._id; 

    const userProducts = await Product.find({ owner: userId });
    res.status(200).json(userProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserBarterOffers = async (req, res) => {
  try {
    const userId = req.user._id; 

    const userBarterOffers = await Product.find({ 'barterOffers.user': userId });
    res.status(200).json(userBarterOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { register, login, profile, updateUserProfile, deleteUserProfile, getUserProducts, getUserBarterOffers};
