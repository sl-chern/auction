import { body } from 'express-validator';

const validateOrder = [
    body("productId")
        .exists()
        .withMessage('Product Id is required')
        .isInt()
        .withMessage('Product Id should be integer'),
    body("city")
        .exists()
        .withMessage('City is required')
        .isString()
        .withMessage('City should be string'),
    body("postOffice")
        .exists()
        .withMessage('Post Office is required')
        .isInt()
        .withMessage('Post Office should be integer'),
    body("postType")
        .exists()
        .withMessage('Post Type is required')
        .isInt()
        .withMessage('Post Type should be integer'),
    body("deliveryPrice")
        .exists()
        .withMessage('Delivery Price is required')
        .isFloat()
        .withMessage('Delivery Price should be float number'),
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
]

export default validateOrder