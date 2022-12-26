import { body } from 'express-validator';

const validateUser = [
    body('phone')
        .optional()
        .isLength({ min: 12 })
        .withMessage('Must be 12 chars long')
        .isLength({ max: 13 })
        .withMessage('Must be 13 chars long'),
    body('firstName')
        .optional()
        .custom(value => {
            const re = /^(([a-zA-Z'-]{1,30})|([а-яА-ЯЁёІіЇїҐґЄє'-]{1,30}))$/u
            return re.test(value);
        })
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('lastName')
        .optional()
        .custom(value => {
            const re = /^(([a-zA-Z'-]{1,30})|([а-яА-ЯЁёІіЇїҐґЄє'-]{1,30}))$/u
            return re.test(value);
        })
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
]

export default validateUser