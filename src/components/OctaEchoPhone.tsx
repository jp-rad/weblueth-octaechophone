import React from 'react';
import { WbBoundCallback } from '@weblueth/statemachine';
import { WbxCustomEventCallback, WbxServiceProps, WbxServices } from '@weblueth/react';
import { Services } from './OctaEchoPhoneContextProvider';
import { OctaEchoPhoneService, Keypad } from '../services/OctaEchoPhoneService';

interface Props extends WbxServiceProps<OctaEchoPhoneService> {
    onKeypadChanged?: WbxCustomEventCallback<Keypad>;
}

const keypadChanged = 'keypadChanged';

export function OctaEchoPhone(props: Props) {
    const onServicesBound: WbBoundCallback<Services> = bound => {
        const target = bound.target.octaEchoPhoneService;
        if (target) {
            if (bound.binding) {
                if (props.onKeypadChanged) {
                    target.addEventListener(keypadChanged, props.onKeypadChanged);
                }
            } else {
                if (props.onKeypadChanged) {
                    target.removeEventListener(keypadChanged, props.onKeypadChanged);
                }
            }
            if (props.onServiceBound) {
                props.onServiceBound({ ...bound, target });
            }
        }
    };

    return (
        <WbxServices onServicesBound={onServicesBound} />
    );
}
