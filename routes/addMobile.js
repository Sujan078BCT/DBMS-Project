const express = require('express');
const toast = require('../utilities/toast');
const router = express.Router();
const userProcedures = require('../procedures/userProcedures');

router.post('/', function (req, res) {
    const id = req.session.userId
    const mobile = req.body.mobile
    if (mobile.length > 20) {
        toast.showToast(req, 'error', 'Mobile must be within 20 digits');
        res.redirect('back');
    }
    else {
        userProcedures.addMobile(id, mobile).then(() => {
            toast.showToast(req, 'success', 'Mobile added successfully')
            res.redirect('back')
        }).catch(err => {
            toast.showToast(req, 'error','Phone number already added.')
            res.redirect('back')
        })
    }
});

module.exports = router;
