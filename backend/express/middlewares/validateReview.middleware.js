import { body } from 'express-validator';

const validateReview = [
    body("sellerId")
        .exists()
        .withMessage('Seller Id is required')
        .isInt()
        .withMessage('Seller Id should be integer'),
    body("mark")
        .exists()
        .withMessage('Mark is required')
        .isBoolean()
        .withMessage('Mark should be bool'),
    body("Text")
        .exists({checkFalsy: true})
        .withMessage('Text is required')
        .isString()
        .withMessage('Text should be string'),
]

export default validateReview