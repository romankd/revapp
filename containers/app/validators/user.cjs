const {body, check, validationResult} = require('express-validator');
const userController = require("../controllers/user.cjs")
const invalidDataStatus = 422

exports.validateDateOfBirth = [
    body('dateOfBirth').trim()
        .escape()
        .notEmpty()
        .withMessage('dateOfBirth can not be empty!')
        .bail()
        .isLength(10)
        .withMessage('Invalid length of the dateOfBirth, must be 10 characters')
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Invalid input of the dateOfBirth, must be yyyy-mm-dd')
        .bail()
        .isDate()
        .withMessage('Invalid input of the dateOfBirth')
        .bail()
        .custom(async value => {
            const bday = new Date(value);
            const date = new Date();
            date.setHours(0, 0, 0, 0);

            if (bday > date) {
                throw new Error('DateOfBirth can not be larger than today.');
            }
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(invalidDataStatus).json({errors: errors.array()});
        next();
    },
];

exports.validateUsername = [
    check('username')
        .trim()
        .isAlpha()
        .withMessage('Only letters are allowed.')
        .bail()
        .notEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({min: 3, max: 15})
        .withMessage('Length should be between 3 and 15 characters!')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(invalidDataStatus).json({errors: errors.array()});
        next();
    },
];