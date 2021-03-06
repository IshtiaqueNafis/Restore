import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";
import {history} from '../..' // this means index 

//region **axios settings**
axios.defaults.baseURL = 'http://localhost:5000/api/'; // the base url to get the backend. 
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data; // base responsebody , return data from the body. 
//endregion 
//region ***axios interceptors used for respnse back from requests*** 
axios.interceptors.response.use(response => {
    return response; // returns normal response if there is no error. 
}, (error: AxiosError) => { // check for error. 
    const {data, status} = error.response!; // get data and status from the error.response. 
    switch (status) {
        case 400:
            // @ts-ignore
            if (data.errors) {
                const modelStateErrors: string[] = [];
                // @ts-ignore
                for (const key in data.errors) {
                       // find the key in data 
                    // @ts-ignore
                    if (data.errors[key]) {
                        // @ts-ignore
                        modelStateErrors.push(data.errors[key]); // find the errors and push it in. 
                    }

                }
                throw modelStateErrors.flat(); //make the errors into sentence. 
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

// requests set up 
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