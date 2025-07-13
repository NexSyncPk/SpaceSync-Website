import { LoginFormData, SignupFormData } from "@/schema/validationSchemas";
import api from "../interceptor";
import { USER_LOGIN, USER_REGISTER } from "../endpoints";

const login = async(data: LoginFormData) => {
    try {
        const response = await api.post(USER_LOGIN, data);
        console.log('Login response:', response);
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Let the component handle the error
    }
}

const signup = async(data: SignupFormData) => {
    // Extract all fields except confirmPassword (which is validation-only)
    const { confirmPassword, ...submissionData } = data;
    
    console.log('Signup submission data:', submissionData);
    
    try {
        const response = await api.post(USER_REGISTER, submissionData);
        console.log('Signup response:', response);
        return response;
    } catch (error) {
        console.error('Signup error:', error);
        throw error; // Let the component handle the error
    }
}

export {
    login,
    signup
}