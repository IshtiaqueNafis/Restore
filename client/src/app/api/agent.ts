﻿import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {history} from '../..' // this means index 
axios.defaults.baseURL = 'http://localhost:5000/api/'; // the base url
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data; // base responsebody 

//region ***axios interceptors used for respnse back from requests*** 
axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response!;
    switch (status) {
        case 400:
            // @ts-ignore
            if (data.errors) {
                const modelStateErrors: string[] = [];
                // @ts-ignore
                for (const key in data.errors) {

                    // @ts-ignore
                    if (data.errors[key]) {
                        // @ts-ignore
                        modelStateErrors.push(data.errors[key]);
                    }

                }
                throw modelStateErrors.flat();
            }
            // @ts-ignore
            toast.error(data.title);
            break;
        case 401:
            // @ts-ignore
            toast.error(data.title);
            break;
        case 500:
            history.push("/server-error")
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})
//endregion
const requests = {
    get: (url: string) => axios.get(url, { headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    post: (url: string, body: {}, ) => axios.post(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody),
    delete: (url: string) => axios.delete(url,{ headers: { "Access-Control-Allow-Credentials": "true" } }).then(responseBody)
};

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    GetValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity: number = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity: number = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}
const Catalog = {
    list: () => requests.get('products'), // returns a list of products here 
    details: (id: number) => requests.get(`products/${id}`) //return product details here 
}
const agent = {
    Catalog,
    TestErrors,
    Basket

}


export default agent;