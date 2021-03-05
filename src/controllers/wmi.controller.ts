import { WmiService } from '../services/wmi.service'
import { ScannerService } from '../services/scanner.service'

// 
const Wmi = new WmiService()
const RequestComputerInfo = async (host: string) => {
    const os = await Wmi.getWin32Info(host)
    const hw = await Wmi.getHwInfo(host)
    const bios = await Wmi.getBiosInfo(host)
    const net = await Wmi.getNetInfo(host)
    return {
        os: os,
        hw: hw,
        bios: bios,
        net: net
    }
}

export const getComputerInfo = async (host: string): Promise<any> => {
    const Scanner = new ScannerService(host)

    // check if the host is a vlid ipv4 address
    if (Scanner.isIpv4()) {
        try {
            const rpc = await Scanner.checkRcp()
            const computerInfo = rpc ? await RequestComputerInfo(host) : `Port 135 not open`
            return computerInfo
        } catch (error) {
            return error.code
        }
    }
    // if it's not a valid ip, it checks the hostname  against dns 
    else {
        try {
            const dns = await Scanner.dnsLookup()
            const rpc = await Scanner.checkRcp()
            const computerInfo = rpc ? await RequestComputerInfo(dns) : `port 135 not open`
            return computerInfo
        } catch (error) {
            return error.code
        }
    }
}

