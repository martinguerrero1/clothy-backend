import { Schema, model } from "mongoose";

const productImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: {
      type: [productImageSchema],
      validate: {
        validator(images) {
          return images.length <= 5;
        },
        message: "Un producto puede tener como máximo 5 imágenes",
      },
      default: [],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    gender: {
      type: String,
      enum: ["hombre", "mujer", "unisex"],
      required: true,
      trim: true,
      lowercase: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    unitsSold: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform: (_, product) => {
        product.id = product._id;
        delete product._id;

        return product;
      },
    },
  }
);

const ProductModel = model("Product", productSchema);

export default ProductModel;
