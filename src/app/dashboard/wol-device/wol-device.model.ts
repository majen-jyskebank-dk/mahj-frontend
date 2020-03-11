export interface IWolDevice {
    _id: string;
    name: string;
    macAddress: string;
    localIpAddress: string;
    externalIpAddress: string;
    icon: string;
    status: string;
}

export class WolDevice implements IWolDevice {
    // tslint:disable-next-line:variable-name
    public _id: string;
    name: string;
    macAddress: string;
    localIpAddress: string;
    externalIpAddress: string;
    icon: string;
    status: string;

    constructor(wolDevice?: IWolDevice) {
        this._id = wolDevice && wolDevice._id || '';
        this.name = wolDevice && wolDevice.name || '';
        this.macAddress = wolDevice && wolDevice.macAddress || '';
        this.localIpAddress = wolDevice && wolDevice.localIpAddress || '';
        this.externalIpAddress = wolDevice && wolDevice.externalIpAddress || '';
        this.icon = wolDevice && wolDevice.icon || 'device_unknown';
        this.status = wolDevice && wolDevice.status || 'inactive';
    }
}
