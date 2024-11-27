const Order = require('../models/order');
const Product = require('../models/product');

// Create new order => /api/v1/order/new
exports.newOrder = async (req, res) => {
    try {
      // Logic to create a new order
      const orderData = req.body; // The data from the client side
      const order = new Order(orderData);
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get single order
exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get logged in user's orders
exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders - ADMIN
exports.allOrders = async (req, res, next) => {
    const orders = await Order.find();

    if (!orders) {
        return res.status(404).json({
            success: false,
            message: 'No Orders found'
        });
    }

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    return res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
}

// Update / Process order - ADMIN
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'You have already delivered this order'
            });
        }

        

        order.orderStatus = req.body.status;
        order.deliveredAt = Date.now();

        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
        
    }
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete order - ADMIN 

// Delete order - ADMIN
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Order is deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
