import { 
    getAllUsersService, 
    getUserByIdService, 
    updateUserService,
    deleteUserService
} from "../models/userModel.js";

//standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status: status,
        message: message,
        data: data
    });
};

// Note: createUser is now handled by auth signup
export const createUser = async (req, res, next) => {
    try {
        return handleResponse(res, 400, 'Please use /api/auth/signup to create new users');
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, 'Users fetched successfully', users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User fetched successfully', user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const user = await updateUserService(req.params.id, name, email);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User updated successfully', user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await deleteUserService(req.params.id);
        if (!deletedUser) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User deleted successfully', deletedUser);
    } catch (error) {
        next(error);
    }
};