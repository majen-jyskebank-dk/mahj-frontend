export class WolDevice {
    id: string;
    name: string;
    localIp: string;
    icon: string;
    status: string;
    sshEnabled: boolean;

    constructor(id: string, name: string, localIp: string, icon: string, status: string, sshEnabled: boolean) {
        this.id = id;
        this.name = name;
        this.localIp = localIp;
        this. icon = icon;
        this.status = status;
        this.sshEnabled = sshEnabled;
    }
}