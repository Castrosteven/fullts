import dns from 'dns'
import net from 'net'
import { spawn } from 'child_process'
export const ScannerService = class {
    host: string
    constructor(host: string) {
        this.host = host

    }
    // Returns the ip address of a hostname
    async dnsLookup(): Promise<string> {
        return new Promise((resolve, reject) => {
            dns.lookup(this.host, (err, address, family) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(address)
                }
            })
        })
    }
    //returns the hostname of an ip address
    async reverseLookup(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            dns.reverse(this.host, (err, hostnames) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(hostnames)
                }
            })
        })
    }
    //checks thats is a valid ipv4 address
    isIpv4(): boolean {
        return net.isIPv4(this.host)
    }
    async checkRcp() {
        const check = spawn("powershell.exe", [
            `Test-NetConnection -ComputerName ${this.host} -port 135  -WarningAction SilentlyContinue | ConvertTo-Json`
        ]);
        let data = "";
        for await (const chunk of check.stdout) {
            // console.log("stdout chunk: " + chunk);
            data += chunk;
        }
        let error = "";
        for await (const chunk of check.stderr) {
            // console.error("stderr chunk: " + chunk);
            error += chunk;
        }
        const exitCode = await new Promise((resolve, reject) => {
            check.on("close", resolve);
        });

        if (exitCode) {
            return false;
        }
        const result = JSON.parse(data).TcpTestSucceeded;
        return result;
    }

}
