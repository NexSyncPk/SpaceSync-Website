import { ORGANIZATION_BY_ID } from "../endpoints";
import api from "../interceptor";

const fetchOrganizationByUser = (userId: string)=>{
    try{
        const response = api.get(ORGANIZATION_BY_ID(userId));
        return response;

    }catch(error){
     console.log("error: ", error);   
     return false;
    }
}

export{
    fetchOrganizationByUser
}