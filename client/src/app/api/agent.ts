import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";

axios.defaults.baseURL = 'http://localhost:5000/api/'; // the base url
const responseBody = (response: AxiosResponse) => response.data; // base responsebody 

//region ***axios interceptors used for respnse back from requests*** 
axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response!;
    switch (status) {
        case 400:
            // @ts-ignore
            if(data.errors){
                const modelStateErrors: string[] = [];
                // @ts-ignore
                for (const key in data.errors) {
                    console.log(key) // probnlem 1, problem 2 
                    // @ts-ignore
                    if (data.errors[key]){
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
            // @ts-ignore
            toast.error(data.title);
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})
//endregion
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    GetValidationError: () => requests.get('buggy/validation-error'),
}
const Catalog = {
    list: () => requests.get('products'), // returns a list of products here 
    details: (id: number) => requests.get(`products/${id}`) //return product details here 
}
const agent = {
    Catalog,
    TestErrors

}


export default agent;