import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  barterOffers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
      offeredProduct: { type: String }, 
      message: { type: String }, 
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, 
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

export default Product;
