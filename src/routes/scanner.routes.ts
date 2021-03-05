import express, { Request } from 'express'
export const ScanRouter = express.Router();
import { verifyHost } from '../controllers/scanner.controller'


ScanRouter.get('/scan', async (request: Request, response) => {
    //Declare the host 
    const host = request.query.host as string
    //check if host exists
    if (request.query.host) {
        const scanResult = await verifyHost(host)
        response.json(scanResult)
    }
    else {
        response.send(`This endpoint expects a query paramater ?host= , with an IP or Hostname`)
    }
});


