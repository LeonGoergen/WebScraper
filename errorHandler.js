

export function errorHandler(error, module){
    let status=500
    if (error.response && error.response.status){
        status=error.response.status
    }
    switch (status){
        case 400:
            throw new Error(`400 Bad Request at ${module}`,{cause: error.response})
        case 401:
            throw new Error(`401 Unauthorized at ${module}`,{cause: error.response})
        case 403:
            throw new Error(`403 Forbidden at ${module}`,{cause: error.response})
        case 404:
            throw new Error(`404 Not Found at ${module}`,{cause: error.response})
        case 429:
            throw new Error(`429 Too many Requests at ${module}`,{cause: error.response})
        case 500:
            throw new Error(`500 Internal Server Error at ${module}`,{cause: error.response})
        case 502:
            throw new Error(`502 Bad Gateway at ${module}`,{cause: error.response})
        case 503:
            throw new Error(`503 Service unavailable at ${module}`,{cause: error.response})
        default:
            throw new Error(`Error at ${module}`,{cause: error.response})
    }
}