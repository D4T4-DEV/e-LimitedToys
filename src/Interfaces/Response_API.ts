type JsonData = { [key: string]: any }; // -> Objeto JSON 

export interface RespuestaApi {
    status: number;
    message: string;
    data?: JsonData
}