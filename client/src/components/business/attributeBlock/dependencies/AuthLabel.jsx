import React from 'react';
import authComponent from "utils/authComponent";

function ValueLabel(props) {
    return props.value
}

const AuthValueLabel = authComponent(ValueLabel);

export default AuthValueLabel

