// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
const auth = require("../middleware/auth");

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

// Import controllers
var contactController = require('../controllers/contactController');
var userController = require('../controllers/userController');

// Contact routes
router.route('/contacts')
    .get(auth, contactController.index)
    .post(auth, contactController.new);
router.route('/contacts/:contact_id')
    .get(auth, contactController.view)
    .patch(auth, contactController.update)
    .put(auth, contactController.update)
    .delete(auth, contactController.delete);

router.route('/register')
    .post(userController.register);
router.route('/login')
    .post(userController.login);



// Export API routes
module.exports = router;