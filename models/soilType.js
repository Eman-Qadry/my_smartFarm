const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soilTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  properties: {
    drainage: {
      type: String,
      required: true,
    },
    fertility: {
      type: String,
      required: true,
    },
    waterRetention: {
      type: String,
      required: true,
    },
    commonUses: {
      type: String,
      required: true,
    },
  }
}); 

module.exports=mongoose.model('soilTypes', soilTypeSchema);