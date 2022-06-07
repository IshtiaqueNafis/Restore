import React, {useState} from 'react';
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";


interface Props {
    items: string[]; // all the items being passed 
    checked?: string[];
    onChange: (items: string[]) => void;
}

const CheckBoxButtons = ({items, checked, onChange}: Props) => {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if (currentIndex === -1) { // means there is no checked items. 
            newChecked = [...checkedItems, value];
        } else {
            newChecked = checkedItems.filter(item => item !== value);
        }
        setCheckedItems(newChecked); // set checked items 
        onChange(newChecked); // pass it on change. 
    }

    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel control={<Checkbox
                    checked={checkedItems.indexOf(item) !== -1} // meanms item is checked. 
                    onClick={() => handleChecked(item)}

                />} label={item} key={item}/>
            ))}
        </FormGroup>
    );
};

export default CheckBoxButtons;