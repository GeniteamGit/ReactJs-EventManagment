import React, {useEffect, useState} from 'react'
import {Toggle} from "react-toggle-component";
import editIcon from "../images/newUI/icons/edit.png";
import styled from "styled-components";
import {Input} from "reactstrap";
import {Button} from 'shards-react';
import deletIcon from "../images/newUI/icons/delete.png";
import config from "../utils/constants.json";

const DragItem = styled.div`
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: white;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
`;
export const ItemSignupFlow = ({provided, snapshot, _field, i, toggleUser, editIdea, removeFormField}) => {
    const [defaultFields, setDefaultFields] = useState([]);

    useEffect(() => {
        const _defaultFields = config.signUpScreens.map((item) => {
            return item.title;
        })
        
        setDefaultFields(_defaultFields);
    }, [])

    const _toggleUser = (i) => {
        toggleUser(i)
    }
    const _editIdea = (i, title) => {
        editIdea(i, title);
    }
    const _removeFormField = () => {
        removeFormField(i);
    }

    return (
        <DragItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >

            <div key={_field} className="row align-items-center">
                <div className='col-2'>
                    <p className="mb-0   mx-4">{i + 1}</p>
                </div>
                <div className='col-2'>
                    <p className="mb-0 ">{_field.title}</p>
                </div>
                <div className='col-2'>
                    <p className="mb-0 ">{_field.type && _field.type.replace(/^\w/, c => c.toUpperCase())}</p>
                    {/*.charAt(0).toUpperCase() + _field.type.slice(1)*/}
                </div>
                <div className='col-2'>
                    <div>
                        <Toggle
                            name={`enable${i}`}
                            className="mx-3"
                            onChange={() => _toggleUser(i)}
                            disabled={_field.title === "Name"}
                            checked={_field.enabled}
                            controlled={_field.enabled}
                            rightKnobColor="#2b900e"
                            rightBorderColor="#2b900e"
                            knobHeight="12px"
                            knobWidth="12px"
                            height="20px"
                            width="40px"
                        />
                    </div>
                </div>
                {_field.options ?
                    <div className='col-2'>
                        <Input
                            id="options"
                            className="modalSelect rounded-0 "
                            type="select"
                            value={_field.options[0]}
                            name="options"
                        >
                            {_field.options && _field.options.length > 0 && _field.options.map((_option) => (
                                <option
                                    className="fsw-semibold text-dark">{_option}</option>
                            ))}
                        </Input>
                    </div> : <div className='col-2'/>}
                {/*{!defaultFields.includes(_field.title) &&*/}
                <div className="col-2 text-end">
                    <Button
                        className="deleteBtn"
                        onClick={() => {
                            _removeFormField(i);
                        }}
                        disabled={_field.title === "Name"}
                    >
                        <img src={deletIcon} alt="" height={15}/>
                    </Button>
                    <Button className="editBtn ms-1"
                            disabled={_field.title === "Name"}
                            onClick={() => {
                                _editIdea(i, _field)
                            }}>
                        <img src={editIcon} alt="" height={15}/>
                    </Button>
                </div>
                {/*}*/}
            </div>


        </DragItem>

    )
}
