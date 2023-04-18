import React, {useEffect} from 'react';
import {Input} from "reactstrap";

const CustomInput = (props) => {
    useEffect(() => {
        
    }, [])
    return (
        <div className="customInput">
            <div className="d-flex align-items-center">
                <img src={props.icon} alt="" height="25" width="30" className="mx-3"/> <span
                className="fs-3 my-0 py-0 fw-lighter">|</span>
                <Input placeholder={props.placeholder} className=" fs-5 customInputBox" required={true}
                       invalid={!(props.isInvalid === undefined || !props.isInvalid)}
                       valid={!(props.isValid === undefined || !props.isValid)}
                       maxLength={props.maxLength}
                       type={props.type} value={props.value} onChange={props.onChange}/>
            </div>
        </div>
    );
};

export default CustomInput;