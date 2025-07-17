import { ORGANIZATION_BY_ID, ORGANIZATION_USERS, ORGANIZATIONS, ROOMS, USER_BY_ID, USER_CREATE_ORGANIZATION, USER_JOIN_ORGANIZATION } from "../endpoints";
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

const getUserById = (userId:string)=>{
    try {
        const response = api.get(USER_BY_ID(userId));
        return response;
    } catch (error) {
        console.log("Error: ", error);
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

const joinOrganization = (data: any)=>{
    try {
        const response = api.post(USER_JOIN_ORGANIZATION, data);
        return response;
    } catch (error) {
        console.log("Error: ", error);
        return false;
    }
}

const getAllOrganizations = ()=>{
    try {
        const response = api.get(ORGANIZATIONS);
        return response;
    } catch (error) {
        console.log("Error: ",error);
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

const getOrganizationMembers = (organizationId: string)=>{
    try {
        const response = api.get(ORGANIZATION_USERS(organizationId));
        return response;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

export{
    fetchOrganizationByUser,
    createOrganization,
    getAllRooms,
    getUserById,
    getAllOrganizations,
    joinOrganization,
    getOrganizationMembers
}