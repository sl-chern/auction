import { body } from 'express-validator';

const validateUpdateProduct = [
    body("name")
        .optional()
        .isString()
        .withMessage('Name should be string'),
    body("curPrice")
        .optional()
        .isFloat()
        .withMessage('Price should be float number'),
    body("description")
        .optional()
        .isString()
        .withMessage('Description should be string'),
    body("location")
        .optional()
        .isString()
        .withMessage('Location should be string'),
    body("startDate")
        .optional()
        .isDate()
        .withMessage('Start date should be date'),
    body("endDate")
        .optional()
        .isDate()
        .withMessage('End date should be date'),
]

export default validateUpdateProduct