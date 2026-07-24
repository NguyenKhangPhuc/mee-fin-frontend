export interface ResponseError {
    success: boolean,
    message: string,
    code: string;
    path: string;
    statusCode: number;
    timestamp: string;
}