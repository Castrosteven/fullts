import { verify } from "crypto";

import { ScannerService } from '../services/scanner.service'
import { DnsResult } from '../interfaces/scanner.interfaces'


export const verifyHost = async (host: string): Promise<DnsResult> => {
    const Scanner = new ScannerService(host)
    // check if the host is a vlid ipv4 address
    if (Scanner.isIpv4()) {
        //if is a valid ip, it returns back the hostname
        const hostname = await Scanner.reverseLookup().then((host => {
            return Array.isArray(host) ? host[0] : host
        })).catch((err) => {
            return err.code
        })
        //returns a ip+host object
        return { address: host, hostname: hostname }
    }
    // if it's a valid ip, it checks the hostname  against dns 
    else {
        const dns = await Scanner.dnsLookup()
            .then((host => {
                return host
            })).catch((err) => {
                return err.code
            })
        //returns the hostname, and the ip address
        return {
            address: dns,
            hostname: host,
        }
    }
}

