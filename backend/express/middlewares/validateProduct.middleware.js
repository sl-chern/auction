import { body } from 'express-validator';

const validateProduct = [
    body("name")
        .exists()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name should be string'),
    body("currentPrice")
        .exists()
        .withMessage('Price is required')
        .isFloat()
        .withMessage('Price should be float number'),
    body("description")
        .exists()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description should be string'),
    body("location")
        .exists()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location should be string'),
    body("startDate")
        .exists()
        .withMessage('Start date is required'),
    body("endDate")
        .exists()
        .withMessage('End date is required'),
]

export default validateProduct