import axios from 'axios'
const URL = "https://localhost:8080";
const HEADERS = {
                'Content-Type':'application/json',
                "Access-Control-Allow-Origin": URL,
                "Access-Control-Allow-Headers": "accept, origin, x-requested-with, content-type",
                "Access-Control-Allow-Methods": "DELETE",
                "Access-Control-Allow-Methods": "OPTIONS",
                "Access-Control-Allow-Methods": "PUT",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Methods": "POST"
            }

export const login = async (email, password ) => {
   const obj = {
            method:'POST',
            headers:HEADERS,
            mode:'cors',
            
        }
        const response = await axios.post(URL+'/users/login',{email:email,password:password}, obj);
        return response;
}

export const callMethods = async (param) => {
    const obj = {
            method:'POST',
            headers:HEADERS,
            mode:'cors',
        
        }
        const response = axios.post(URL+'/airNextTokenList/methods', {funct:param.name,inputs:param.inputs,stateMutability:param.stateMutability,sender:sender},obj)
        return response;
}