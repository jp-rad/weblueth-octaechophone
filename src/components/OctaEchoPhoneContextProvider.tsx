import React from 'react';
import { createServiceBuilder } from '@weblueth/gattbuilder';
import { WbxContextProvider } from '@weblueth/react';
import { OctaEchoPhoneService } from '../services/OctaEchoPhoneService'

const requestDevice = async (bluetooth: Bluetooth): Promise<BluetoothDevice | undefined> => {
    return await bluetooth.requestDevice({
        filters: [{ services: [OctaEchoPhoneService.service_uuid] }],
        optionalServices: [OctaEchoPhoneService.uuid]
    });
};

export type Services = {
    octaEchoPhoneService?: OctaEchoPhoneService;
}

const retrieveServices = async (device: BluetoothDevice): Promise<Services> => {
    if (!device || !device.gatt) {
        return {};
    }

    if (!device.gatt.connected) {
        await device.gatt.connect();
    }
    const services = await device.gatt.getPrimaryServices();
    const builder = createServiceBuilder(services);
    const octaEchoPhoneService = await builder.createService(OctaEchoPhoneService);
    return { octaEchoPhoneService, };
};

type Props = {
    children: any;
    bluetooth?: Bluetooth;
    connectionName?: string;
}

export function OctaEchoPhoneContextProvider(props: Props) {
    const connectionName = props.connectionName ?? "Octa echo phone";
    return (
        <WbxContextProvider
            retrieveServices={retrieveServices} requestDevice={requestDevice}
            bluetooth={props.bluetooth} connectionName={connectionName}>
            {props.children}
        </WbxContextProvider>
    );
}
