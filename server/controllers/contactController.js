// Import contact model
Contact = require('../models/contactModel');
// Handle index actions
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.status(400).json({
                status: "error",
                message: err,
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "Contacts retrieved successfully",
                data: contacts
            });
        }
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    // save the contact and check for errors
    contact.save(function (err) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json({
                message: 'New contact created!',
                data: contact
            });
        }
    });
};
// Handle view contact info
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
            console.log(err)
            res.status(404).send(err);
        } else if (contact == null) {
            res.status(404).json({
                message: 'Contact Not Found',
                data: { contact_id: (req.params.contact_id) }
            });
        } else {
            res.status(200).json({
                message: 'Contact details loading..',
                data: contact
            });
        }
    });
};
// Handle update contact info
exports.update = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
            res.status(400).send(err);
        } else if (contact == null) {
            res.status(404).json({
                message: 'Contact Not Found',
                data: { contact_id: (req.params.contact_id) }
            });
        } else {
            contact.name = req.body.name ? req.body.name : contact.name;
            contact.gender = req.body.gender;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            // save the contact and check for errors
            contact.save(function (err) {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.json({
                        message: 'Contact Info updated',
                        data: contact
                    });
                }
            });
        }
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err) {
            res.status(400).send(err);
        } else if (contact == null) {
            res.status(404).json({
                message: 'Contact Not Found',
                data: { contact_id: (req.params.contact_id) }
            });
        } else {
            Contact.remove({
                _id: req.params.contact_id
            }, function (err, contact) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json({
                        status: "success",
                        message: 'Contact deleted'
                    });
                }
            });
        }
    });
};