import express, { Request } from 'express'
export const WmiRouter = express.Router();
import { getComputerInfo } from '../controllers/wmi.controller'


WmiRouter.get('/computer', async (request: Request, response) => {
    //Declare the host 
    const host = request.query.host as string
    //check if host exists
    if (request.query.host) {
        const scanResult = await getComputerInfo(host)
        response.json(scanResult)
    }
    else {
        response.send(`This endpoint expects a query paramater ?host= , with an computer name`)
    }
});


