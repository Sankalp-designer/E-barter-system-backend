import Product from '../models/product.js';
import User from '../models/user.js';

const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const sellerId = req.user.userId;
    console.log('Seller ID:', sellerId);

    const product = new Product({
      name,
      description,
      price,
      seller: sellerId,
    });

    await product.save();

    const user = await User.findById(sellerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.products.push(product._id);
    await user.save();

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'username'); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userProducts = await Product.find({ seller: userId });
    res.status(200).json(userProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerId = req.user.userId; 

    const product = await Product.findById(productId);
    if (!product || product.seller.toString() !== sellerId) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createOffer = async (req, res) => {
  try {
    const { offeredProduct, message } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newOffer = {
      user: userId,
      offeredProduct,
      message,
      status: 'pending',
    };

    product.barterOffers.push(newOffer);
    await product.save();

    res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const productId = req.params.productId;
    const offerId = req.params.offerId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const offerIndex = product.barterOffers.findIndex((offer) => offer._id.toString() === offerId);
    if (offerIndex === -1) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    product.barterOffers[offerIndex].status = 'accepted';
    await product.save();

    res.status(200).json({ message: 'Offer accepted successfully', offer: product.barterOffers[offerIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectOffer = async (req, res) => {
  try {
    const productId = req.params.productId;
    const offerId = req.params.offerId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const offerIndex = product.barterOffers.findIndex((offer) => offer._id.toString() === offerId);
    if (offerIndex === -1) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    product.barterOffers[offerIndex].status = 'rejected';
    await product.save();

    res.status(200).json({ message: 'Offer rejected successfully', offer: product.barterOffers[offerIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createProduct, getAllProducts, deleteProduct, getUserProducts, createOffer, acceptOffer, rejectOffer, getProductById};
