import React from 'react';

const PrintArea = ({...props}) => {
    return(
            <div id={"printArea"}>
            {props.children}
            </div>
    )
};
export default PrintArea