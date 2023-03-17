import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

// the first argument to getData query is the starting object. Mostly it won't exist for Query types.
//  but if I create a resolver for a specific object, then it's first argument would be the return value of the query associated with it.

const product = (_, args) => {
  return Product.findById(args.id)
    .lean()
    .exec()
}

const products = () => {
  return Product.find({}).exec()
}

const newProduct = (_, args, ctx) => {
  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const updateProduct = (_, args) => {
  // specifying new: true means that i want the return value of this function to be the value after update (not before update)
  return Product.findByIdAndUpdate(args.id, args.input, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args) => {
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    // getData(_, args, context, info) {},
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
