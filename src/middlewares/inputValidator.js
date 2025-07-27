import joi from 'joi';

// User Registration Schema
const registerSchema = joi.object({
    name: joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters',
        'any.required': 'Name is required'
    }),
    email: joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    })
});

// User Login Schema
const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

// Validation Middleware Functions
export const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    next();
};

// Original user validation (keeping for backward compatibility)
const userSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required()  
});

const validateUserInput = (req, res, next) => {
    const {error}= userSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    next();
}

export default validateUserInput;