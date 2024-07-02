import { Schema, model } from 'mongoose';

const skuSchema = new Schema({
  Id: {
    type: Number,
    required: true
  },
  ProductId: {
    type: Number,
    required: true,
    unique: true
  },
  NameComplete: {
    type: String
  },
  ProductRefId: {
    type: String
  },
  ImageUrl: {
    type: String
  }
}, { collection: 'vtex_catalog_skus' });

export default model('Sku', skuSchema);
