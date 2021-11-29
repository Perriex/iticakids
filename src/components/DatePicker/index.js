import React from 'react';

import dateFnsFormat from 'date-fns/format';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';



export default function DatePicker(props) {
    const { value, name, label, onChange } = props;
    console.log('value',value)
    const FORMAT = 'yyyy/MM/dd';
    return (
        <KeyboardDatePicker
            // disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            inputVariant="outlined"
            fullWidth
            label={label ? label : "date"}
            value={value ? new Date(value) : new Date()}
            onChange={(e) => {
                console.log(e)
                if (onChange) {
                    if (e != 'Invalid Date' && e!=null) {
                        onChange({ target: { value: dateFnsFormat(e, FORMAT), name: name } })
                    }
                } else {
                    return null
                }
            }}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    );
}