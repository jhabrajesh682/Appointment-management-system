const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const jwtPrivatKey = process.env.JWT_PRIVATE_KEY


const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  name: {
    type: String,
    maxlength: 50,
    minlength: 3,
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },

  password: {
    type: String,
    required: true
  },

  officeAddress: {
    country: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25
    },
    city: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25
    },
    address: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255
    },
    zipCode: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
    }
  },

  designation: {
    type: String,
    minlength: 3,
    maxlength: 10,
  },

  logged_in_counterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCounter'
  },


  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  },


}, {
  timestamps: true
});



userSchema.methods.generateAuthToken = function (details) {
  let obj = { _id: this._id, isAdmin: details }
  return jwt.sign(obj, jwtPrivatKey)
}
userSchema.virtual('userRoles', {
  ref: 'UserRoleMapping', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'userId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = Users = mongoose.model("Users", userSchema);
