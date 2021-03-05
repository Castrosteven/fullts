export interface host {
    host: string,
    name: string,
    dns?: string,
    IPAddress?: string
}

export interface hostInfo {
    [index: number]: host
}

export interface win32 {
    PSComputerName: string,
    BuildNumber: string,
    Caption: string,
    Manufacturer: string,
    OSArchitecture: string,
}

export interface adapter {
    MACAddress: string | null,
    IPAddress: Array<string> | null,
    ProductName: string,
    Name: string,
    AdapterType: string | null,
    PSComputerName: string,


}

export interface adapterInfo {
    [index: number]: adapter
}

export interface ComputerSystem {
    Domain: string,
    Manufacturer: string,
    Model: string,
    Name: string
}

export interface biosInfo {
    SerialNumber: string,
}