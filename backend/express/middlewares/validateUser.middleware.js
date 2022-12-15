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
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('lastName')
        .exists()
        .withMessage('Your last name is required')
        .custom(value => {
            const re = /^(([a-zA-Z'-]{1,30})|([а-яА-ЯЁёІіЇїҐґЄє'-]{1,30}))$/u
            return re.test(value);
        })
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body("deviceId")
        .isUUID()
]

export default validateUser