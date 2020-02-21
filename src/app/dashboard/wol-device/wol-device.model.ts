export class WolDevice {
    // tslint:disable-next-line:variable-name
    _id: string;
    name: string;
    localIpAddress: string;
    icon: string;
    status: string;
    sshEnabled: boolean;

    // tslint:disable-next-line:variable-name
    constructor(_id: string, name: string, localIpAddress: string, icon: string, status: string, sshEnabled: boolean) {
        this._id = _id;
        this.name = name;
        this.localIpAddress = localIpAddress;
        this. icon = icon;
        this.status = status;
        this.sshEnabled = sshEnabled;
    }
}
