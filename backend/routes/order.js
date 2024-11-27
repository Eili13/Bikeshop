const express = require('express');
const router = express.Router();    

const { newOrder, getSingleOrder, myOrders, allOrders, updateOrder, deleteOrder } = require('../controllers/order');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/order/').post(newOrder); 
router.route('/order/:id').get( getSingleOrder);
router.route('/orders/me').get( myOrders);
router.route('/orders/all').get(allOrders);
router.route('/orders/:id').patch(updateOrder);
router.route('/order/:id').delete(deleteOrder);

module.exports = router;

