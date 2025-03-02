import { TypedDispatcher, EventDispatcher, ServiceHelper } from "@weblueth/gattbuilder";

/**
 * @hidden
 */
export enum OctaEchoPhoneCharacteristic {

    // LED 0: READ, WRITE NO RESPONSE
    LED0 = "f7fce515-7a0b-4b89-a675-a79137223e2c",      // 0x02: OFF, else(0x01): ON
    // LED 1: READ, WRITE NO RESPONSE
    LED1 = "f7fce516-7a0b-4b89-a675-a79137223e2c",      // 0x02: OFF, else(0x01): ON
    // LED 2: READ, WRITE NO RESPONSE
    LED2 = "f7fce51a-7a0b-4b89-a675-a79137223e2c",      // 0x02: OFF, else(0x01): ON

    // Dimmable LED 0: READ, WRITE NO RESPONSE
    DLED0 = "f7fce517-7a0b-4b89-a675-a79137223e2c",
    // Dimmable LED 1: READ, WRITE NO RESPONSE
    DLED1 = "f7fce518-7a0b-4b89-a675-a79137223e2c",
    // Dimmable LED 2: READ, WRITE NO RESPONSE
    DLED2 = "f7fce51b-7a0b-4b89-a675-a79137223e2c",
    
    // Buzzer: READ, WRITE NO RESPONSE
    Buzzer = "f7fce521-7a0b-4b89-a675-a79137223e2c",

    // Keypad: NOTIFY, READ
    Keypad = "f7fce531-7a0b-4b89-a675-a79137223e2c",    // bit: ---- #*98 7654 3210

    // CDS: NOTIFY, READ
    CDS = "f7fce532-7a0b-4b89-a675-a79137223e2c",

    // RESERVED-33
    RESERVED_33 = "f7fce533-7a0b-4b89-a675-a79137223e2c",
    // RESERVED-E1
    RESERVED_E1 = "f7fce5e1-7a0b-4b89-a675-a79137223e2c",
    // RESERVED-E2
    RESERVED_E2 = "f7fce5e2-7a0b-4b89-a675-a79137223e2c",
    // RESERVED-E3
    RESERVED_E3 = "f7fce5e3-7a0b-4b89-a675-a79137223e2c",
    // RESERVED-E4
    RESERVED_E4 = "f7fce5e4-7a0b-4b89-a675-a79137223e2c",
    
}

/**
 * Events raised by the service
 */
export interface OctaEchoPhoneEvents {
    /**
     * @hidden
     */
    newListener: keyof OctaEchoPhoneEvents;
    /**
     * @hidden
     */
    removeListener: keyof OctaEchoPhoneEvents;
    /**
     * Keypad changed event
     */
    keypadChanged: Keypad;
}

/**
 * Service
 */
export class OctaEchoPhoneService extends (EventDispatcher as new () => TypedDispatcher<OctaEchoPhoneEvents>) {

    /**
     * @hidden
     */
    public static service_uuid = "f7fce500-7a0b-4b89-a675-a79137223e2c";

    /**
     * @hidden
     */
    public static uuid = "f7fce510-7a0b-4b89-a675-a79137223e2c";

    /**
     * @hidden
     */
    public static async create(service: BluetoothRemoteGATTService): Promise<OctaEchoPhoneService> {
        const bluetoothService = new OctaEchoPhoneService(service);
        await bluetoothService.init();
        return bluetoothService;
    }

    private helper: ServiceHelper;

    /**
     * @hidden
     */
    constructor(service: BluetoothRemoteGATTService) {
        super();
        this.helper = new ServiceHelper(service, this as any);
    }

    private async init() {
        await this.helper.handleListener(
            "keypadChanged",
            OctaEchoPhoneCharacteristic.Keypad,
            this.KeypadChangedHandler.bind(this)
        );
    }

    /**
     * Set LED 0
     * @param value
     */
    public async setLED0(on: boolean): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        const value = on ? 1 : 2
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.LED0, view);
    }

    /**
     * Set LED 1
     * @param value
     */
    public async setLED1(on: boolean): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        const value = on ? 1 : 2
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.LED1, view);
    }

    /**
     * Set LED 2
     * @param value
     */
    public async setLED2(on: boolean): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        const value = on ? 1 : 2
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.LED2, view);
    }

    /**
     * Set Dimmable LED 0
     * @param value
     */
    public async setDLED0(value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.DLED0, view);
    }

    /**
     * Set Dimmable LED 1
     * @param value
     */
    public async setDLED1(value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.DLED1, view);
    }

    /**
     * Set Dimmable LED 2
     * @param value
     */
    public async setDLED2(value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.DLED2, view);
    }

    /**
     * Set Buzzer
     * @param value
     */
    public async setBuzzer(value: number): Promise<void> {
        const view = new DataView(new ArrayBuffer(1));
        view.setUint8(0, value);
        return await this.helper.setCharacteristicValue(OctaEchoPhoneCharacteristic.Buzzer, view);
    }

    /**
     * Event handler: keypad changed
     */
    private KeypadChangedHandler(event: Event) {
        const view = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        this.dispatchEvent("keypadChanged", parseKeypadData(view));
    }

    /**
     * Read keypad
     */
    public async readKeypad(): Promise<Keypad> {
        const view = await this.helper.getCharacteristicValue(OctaEchoPhoneCharacteristic.Keypad);
        return parseKeypadData(view);
    }
    
    /**
     * Read CDS
     */
    public async readCDS(): Promise<number> {
        const view = await this.helper.getCharacteristicValue(OctaEchoPhoneCharacteristic.CDS);
        const cds = view.getUint16(0, /*littleEndian=*/true)
        return cds;
    }
}

export type Keypad = {
    value: number;
    key0: boolean;
    key1: boolean;
    key2: boolean;
    key3: boolean;
    key4: boolean;
    key5: boolean;
    key6: boolean;
    key7: boolean;
    key8: boolean;
    key9: boolean;
    keyStar: boolean;
    keyHash: boolean;
}

function parseKeypadData(data: DataView) {
    const value = data.getUint16(0, /*littleEndian=*/true);
    return {
        value,
        key0: (value & 0b0000000000000001) == 0,
        key1: (value & 0b0000000000000010) == 0,
        key2: (value & 0b0000000000000100) == 0,
        key3: (value & 0b0000000000001000) == 0,
        key4: (value & 0b0000000000010000) == 0,
        key5: (value & 0b0000000000100000) == 0,
        key6: (value & 0b0000000001000000) == 0,
        key7: (value & 0b0000000010000000) == 0,
        key8: (value & 0b0000000100000000) == 0,
        key9: (value & 0b0000001000000000) == 0,
        keyStar: (value & 0b0000010000000000) == 0,
        keyHash: (value & 0b0000100000000000) == 0,
    }
}
