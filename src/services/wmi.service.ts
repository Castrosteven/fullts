import { spawn } from 'child_process'
import { win32, ComputerSystem, adapterInfo, biosInfo, adapter } from '../interfaces/wmi.interfaces'
export class WmiService {
    async powerShell(command: string): Promise<string> {
        const child = spawn('powershell.exe', [command]);
        let data = "";
        for await (const chunk of child.stdout) {
            // console.log('stdout chunk: ' + chunk);
            data += chunk;
        }
        let error = "";
        for await (const chunk of child.stderr) {
            // console.error('stderr chunk: ' + chunk);
            error += chunk;
        }
        const exitCode = await new Promise((resolve, reject) => {
            child.on('close', resolve);
        });

        if (exitCode) {
            throw new Error(`subprocess error exit ${exitCode}, ${error}`);
        }
        return data;
    }
    async getWin32Info(host: string): Promise<win32> {
        const response = await this.powerShell(`Get-WmiObject -Class Win32_OperatingSystem -ComputerName ${host} | ConvertTo-Json`)
        const obj = JSON.parse(response)
        const returnObject: win32 = {
            BuildNumber: obj.BuildNumber,
            Caption: obj.Caption,
            Manufacturer: obj.Manufacturer,
            OSArchitecture: obj.OSArchitecture,
            PSComputerName: obj.PSComputerName
        }
        return returnObject
    }
    async getNetInfo(host: string): Promise<adapterInfo> {
        const response = await this.powerShell(`Get-WmiObject -Class Win32_NetworkAdapterConfiguration -ComputerName ${host} | ConvertTo-Json`)
        const response2 = await this.powerShell(`Get-WmiObject -Class Win32_NetworkAdapter -ComputerName ${host} | ConvertTo-Json`)
        const ob2 = JSON.parse(response2)
        const obj = JSON.parse(response)
        const returnObject = obj.map((adapter: adapter) => {
            const obj = {
                IPAddress: adapter.IPAddress,
                PSComputerName: adapter.PSComputerName
            }
            return obj
        })
        const returnObject2 = ob2.map((adapter: adapter) => {
            const obj = {
                MACAddress: adapter.MACAddress,
                IPAddress: adapter.IPAddress,
                AdapterType: adapter.AdapterType,
                Name: adapter.Name,
                ProductName: adapter.ProductName,
                PSComputerName: adapter.PSComputerName
            }
            return obj
        })
        return returnObject2.map((item: any, i: string | number) => Object.assign({}, item, returnObject[i]));
    }
    async getHwInfo(host: string): Promise<ComputerSystem> {
        const response = await this.powerShell(`Get-WmiObject -Class Win32_ComputerSystem -ComputerName ${host} | ConvertTo-Json`)
        const obj = JSON.parse(response)
        const returnObject: ComputerSystem = {
            Domain: obj.Domain,
            Manufacturer: obj.Manufacturer,
            Model: obj.Model,
            Name: obj.Name,
        }
        return returnObject
    }
    async getBiosInfo(host: string): Promise<biosInfo> {
        const response = await this.powerShell(`Get-WmiObject -Class Win32_Bios -ComputerName ${host} | ConvertTo-Json`)
        const obj = JSON.parse(response)
        const returnObject: biosInfo = {
            SerialNumber: obj.SerialNumber
        }
        return returnObject
    }

}