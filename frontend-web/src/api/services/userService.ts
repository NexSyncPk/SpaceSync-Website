import { ORGANIZATION_BY_ID, ROOMS, USER_CREATE_ORGANIZATION } from "../endpoints";
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
const createOrganization = (data:any)=>{
    try {
        const response = api.post(USER_CREATE_ORGANIZATION, data);
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}


const getAllRooms = ()=>{
    try {
        const response = api.get(ROOMS);
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}
export{
    fetchOrganizationByUser,
    createOrganization,
    getAllRooms
}