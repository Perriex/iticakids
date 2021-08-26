import React from 'react';
import classes from './TimeTable.module.css';
import * as Proptypes from 'prop-types';
import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from "axios";

const localizer = momentLocalizer(moment);

const TimeTable = (props) => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        const start = moment().startOf('month').add(-1,'week')._d;
        const end = moment().endOf('month').add(1,'week')._d;
        handleRangeChange([start, end]);
    }, []);
    const handleRangeChange = range => {
        let start, end;
        if (Array.isArray(range)) [start, end] = [range[0].toDateString(), range[range.length - 1].toDateString()];
        else [start, end] = [range.start.toDateString(), range.end.toDateString()];
        setLoading(true);
        axios
            .post(props.dataUrl, {
                start_date: start,
                end_date: end,
                ...props.postData
            })
            .then(res => {
                setLoading(false);
                setEvents(res.data.map(({start, end, ...rest}) =>{
                    return {
                        start: new Date(Date.parse(start)),
                        end: new Date(Date.parse(end)),
                        ...rest
                    }
                }));
            }).catch(() => setLoading(false))
    };
    return (
        <div className={classes.wrapper}>
            <Calendar
                onRangeChange={handleRangeChange}
                onSelectEvent={(a) => props.onSelectEvent(a)}
                selectable={true}
                onSelectSlot={({slots}) => props.onSelectSlots({start: slots[0], end: slots[slots.length - 1]})}
                views={['month', 'week', 'agenda']}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{height: 'calc(100% - 40px)', width: 'calc(100% - 40px)', marginTop: 20}}
            />
            {loading && (
                <div className={classes.backdrop}>
                    <div className={classes.loading}/>
                </div>
            )}
        </div>
    );
};

export default TimeTable;

TimeTable.propTypes = {
    dataUrl: Proptypes.string,
    postData: Proptypes.any,
    onSelectEvent: Proptypes.func,
    onSelectSlots: Proptypes.func,
};

TimeTable.defaultProps = {
    postData: {},
    onSelectEvent: () => {
    },
    onSelectSlots: () => {
    }
};
