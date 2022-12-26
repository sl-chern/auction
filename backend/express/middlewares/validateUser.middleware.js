import { body } from 'express-validator';

const validateUser = [
    body('phone')
        .exists()
        .withMessage('Phone number is required')
        .isLength({ min: 12 })
        .withMessage('Must be 12 chars long')
        .isLength({ max: 13 })
        .withMessage('Must be 13 chars long'),
    body('firstName')
        .exists()
        .withMessage('Your first name is required')
        .custom(value => {
            const re = /^(([a-zA-Z'-]{1,30})|([а-яА-ЯЁёІіЇїҐґЄє'-]{1,30}))$/u
            return re.test(value);
        })
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('lastName')
        .exists()
        .withMessage('Your last name is required')
        .custom(value => {
            const re = /^(([a-zA-Z'-]{1,30})|([а-яА-ЯЁёІіЇїҐґЄє'-]{1,30}))$/u
            return re.test(value);
        })
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email'),
    body("deviceId")
        .exists()
        .withMessage('Device Id is required')
        .isUUID()
        .withMessage('Device Id should be UUID'),
    body("image")
        .exists()
        .withMessage('Image is required')
        .isURL()
        .withMessage('Image should be URL'),
]

export default validateUser