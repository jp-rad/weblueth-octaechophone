import React, { useState } from 'react';
import { WbBoundCallback } from '@weblueth/statemachine';
import { useWbxActor, WbxCustomEventCallback, WbxDevice } from '@weblueth/react';
import { OctaEchoPhone, Keypad, OctaEchoPhoneService } from '../../../src';

const defaultName = "(none)";
const defaultKeyPadText = "----------------";

export default function OctaEchoPhoneDevice() {
    /**
     * State machine (xstate)
     */
    const [state, send] = useWbxActor();
    const connectionName = state.context.conn.name;

    // xstate actions
    const reset = () => send("RESET");
    const request = () => send("REQUEST");
    const connect = () => send("CONNECT");
    const disconnect = () => send("DISCONNECT");

    // rejectedReason
    if (state.context.rejectedReason.type !== "NONE") {
        console.log("rejectedReason:", state.context.rejectedReason.message);
    }

    // disconnectedReason
    if (state.context.disconnectedReason.type !== "NONE") {
        console.log("disconnectedReason:", state.context.disconnectedReason.message);
    }

    /**
     * Device
     */
    const [name, setName] = useState<string>(defaultName);
    const onDeviceBound: WbBoundCallback<BluetoothDevice> = bound => {
        if (bound.binding) {
            setName(bound.target.name!);
        } else {
            setName(defaultName);
        }
    }

    /**
     * Octa Echo Phone Service
     */
    const [octaEchoPhoneService, setOctaEchoPhoneService] = useState<OctaEchoPhoneService | undefined>();

    const [cdsValue, setCdsValue] = useState<number | undefined>(undefined)

    const handleUpdateCDS = async () => {
        if (octaEchoPhoneService) {
            const value = await octaEchoPhoneService.readCDS();
            setCdsValue(value);
        } else {
            setCdsValue(undefined);
        }
    };

    const [brightnessValue, setBrightnessValue] = useState<number>(0);
    const [dledValueText, setdLedValueText] = useState<string>("0,0,0")

    const handleBrightnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const calcLedValue = (value: number, led: number): number => {
            let adjustedValue = value;
            const LED_NUM = 3;
            const MIN_VALUE = 0;
            const MAX_VALUE = 255;
            const OFFSET = 127;
            const TOP_POINT = MAX_VALUE * (LED_NUM - 1) + 1;
            const isOverTop = (adjustedValue > TOP_POINT);
            if (isOverTop) {
                adjustedValue -= TOP_POINT;
            }
            const offset = OFFSET * (led + 1) - OFFSET;
            adjustedValue -= offset;
            if (isOverTop) {
                adjustedValue = MAX_VALUE - adjustedValue;
            }
            return Math.max(MIN_VALUE, Math.min(MAX_VALUE, adjustedValue));
        };
        const newValue = Number(event.target.value);
        setBrightnessValue(newValue);
        const dled0Value = calcLedValue(newValue, 0);
        const dled1Value = calcLedValue(newValue, 1);
        const dled2Value = calcLedValue(newValue, 2);
        setdLedValueText(`${dled0Value},${dled1Value},${dled2Value}`)

        octaEchoPhoneService?.setDLED0(dled0Value);
        octaEchoPhoneService?.setDLED1(dled1Value);
        octaEchoPhoneService?.setDLED2(dled2Value);
    };

    const [led0State, setLed0State] = useState<boolean>(false);

    const handleLed0Toggle = () => {
        const newState = !led0State;
        setLed0State(newState);
        octaEchoPhoneService?.setLED0(newState);
    }

    const [led1State, setLed1State] = useState<boolean>(false);

    const handleLed1Toggle = () => {
        const newState = !led1State;
        setLed1State(newState);
        octaEchoPhoneService?.setLED1(newState);
    }

    const [led2State, setLed2State] = useState<boolean>(false);

    const handleLed2Toggle = () => {
        const newState = !led2State;
        setLed2State(newState);
        octaEchoPhoneService?.setLED2(newState);
    }

    const [buzzerValue, setBuzzerValue] = useState<number>(0);

    const handleBuzzerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        setBuzzerValue(newValue);
        octaEchoPhoneService?.setBuzzer(newValue);
    };

    const [keypad, setKeypad] = useState<Keypad | undefined>(undefined);
    const [keypadText, setKeypadText] = useState<string>(defaultKeyPadText)

    const updateKeypad = (keypad: Keypad | undefined) => {
        if (keypad) {
            const binaryString = keypad.value.toString(2);
            setKeypadText(binaryString.padStart(16, '0'));
        } else {
            setKeypadText(defaultKeyPadText);
        }
        setKeypad(keypad);
    };

    const onKeypadChanged: WbxCustomEventCallback<Keypad> = async event => {
        updateKeypad(event.detail);
    };

    const onOctaEchoPhoneServiceBound: WbBoundCallback<OctaEchoPhoneService> = async bound => {
        if (bound.binding) {
            setOctaEchoPhoneService(bound.target);
            const cds = await bound.target.readCDS();
            setCdsValue(cds);
            const keypad = await bound.target.readKeypad()
            updateKeypad(keypad);
        } else {
            updateKeypad(undefined);
            setCdsValue(undefined);
            setOctaEchoPhoneService(undefined)
        }
    };

    return (
        <>
            <WbxDevice onDeviceBound={onDeviceBound} />
            <OctaEchoPhone onServiceBound={onOctaEchoPhoneServiceBound} onKeypadChanged={onKeypadChanged} />
            {connectionName + ": [" + state.toStrings() + "]"}
            <br />
            <button onClick={reset}>RESET</button>
            <button onClick={request}>REQUEST</button>
            <button onClick={connect}>CONNECT</button>
            <button onClick={disconnect}>DISCONNECT</button>
            <br />
            Name: {name}
            <br />
            CDS: {cdsValue ?? "---"} <button onClick={handleUpdateCDS}>update</button>
            <br />
            LEDs:
            <input type="range" min="0" max="1020" value={brightnessValue} onChange={handleBrightnessChange} />
            <br />
            ({brightnessValue}) = [{dledValueText}]
            <br />
            <label>
                <input type="checkbox" checked={led0State} onChange={handleLed0Toggle} />
                LED0,
            </label>
            <label>
                <input type="checkbox" checked={led1State} onChange={handleLed1Toggle} />
                LED1,
            </label>
            <label>
                <input type="checkbox" checked={led2State} onChange={handleLed2Toggle} />
                LED2
            </label>
            <br />
            Buzzer:
            <input type="range" min="0" max="255" value={buzzerValue} onChange={handleBuzzerChange} />
            <br />
            ({buzzerValue})
            <br />
            Keypad: {keypadText}
            <br />
            {keypad?.key1 ? "1" : "-"}
            {keypad?.key2 ? "2" : "-"}
            {keypad?.key3 ? "3" : "-"}
            <br />
            {keypad?.key4 ? "4" : "-"}
            {keypad?.key5 ? "5" : "-"}
            {keypad?.key6 ? "6" : "-"}
            <br />
            {keypad?.key7 ? "7" : "-"}
            {keypad?.key8 ? "8" : "-"}
            {keypad?.key9 ? "9" : "-"}
            <br />
            {keypad?.keyStar ? "*" : "-"}
            {keypad?.key0 ? "0" : "-"}
            {keypad?.keyHash ? "#" : "-"}
        </>
    );
}
