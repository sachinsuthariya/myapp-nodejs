const mongoose = require("mongoose");
const validate = require("../../helper/validation");
const helper = require("../../helper/commonUtils");
const l10n = require("jm-ez-l10n");
const {
    userStatus
} = require("../../helper/constant");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: [true, l10n.t("ERR_EMAIL_EXIST")],
        required: [true, l10n.t("REQ_EMAIL")],
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
        validate: {
            validator: validate.validateCtr.validEmail,
            message: l10n.t('ERR_VALID_EMAIL')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        validate: [validate.validateCtr.validPassword, l10n.t('ERR_VALID_PASSWORD')]
    },
    varified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        minlength: 5,
        maxlength: 10,
        default: userStatus.inActive
    }
});

// encrypt password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await helper.genHash(this.password);
    next();
});

module.exports = mongoose.model('user', userSchema);