import { LoginFormData } from "@/schema/validationSchemas";
import api from "../interceptor";
import { USER_LOGIN } from "../endpoints";

const login = async(data:LoginFormData)=>{
    try{
        const response = api.post(USER_LOGIN, data);
        console.log(response);
        return response;
        
    }
    catch(error){
        console.log("error: ", error);
        return false;
    }
}

export {
    login
}