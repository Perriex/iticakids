import React from 'react';
import classes from './TimeTable.module.css';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import * as Proptypes from 'prop-types';
import axios from 'axios';
import Loading from "../Loading/Loading";

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const isLeapYear = (year) => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

const getDaysCount = (date) => {
    const monthName = months[Number(date.split('-')[1] - 1)];
    const mapMonthNameToDaysCount = {
        "JAN": 31,
        "MAR": 31,
        "APR": 30,
        "MAY": 31,
        "JUN": 30,
        "JUL": 31,
        "AUG": 31,
        "SEP": 30,
        "OCT": 31,
        "NOV": 30,
        "DEC": 31
    };
    if (mapMonthNameToDaysCount[monthName]) return mapMonthNameToDaysCount[monthName];
    else if (monthName === 'FEB')
        return isLeapYear(Number(date.split('-')[0])) ? 29 : 28;
    return null;
};

const TimeTable = (props) => {
    const {options} = props;

    // state --------------------------------------------

    const [displayType, setDisplayType] = React.useState('Weekly');
    const [dayIndexes, setDayIndexes] = React.useState([]);
    const [currentMonth, setCurrentMonth] = React.useState('');
    const [data, setData] = React.useState([]);
    const [todayIndex, setTodayIndex] = React.useState([]);
    const [todayDate, setTodayDate] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Functionality ---------------------------------------

    const calcDim = (t1, t2, index) => {
        const t1Sec = (Number(t1.split(":")[0]) * 60 * 60) + (Number(t1.split(":")[1]) * 60);
        const t2Sec = (Number(t2.split(":")[0]) * 60 * 60) + (Number(t2.split(":")[1]) * 60);
        const cSize = Number(options.cellSize.split('px')[0]);
        const firstRowHeight = Number(options.firstRowHeight.split('px')[0]);
        const firstColWidth = Number(options.firstColWidth.split('px')[0]);
        return {
            top: ((t1Sec / 3600 - 1) * cSize + firstRowHeight) + 'px',
            height: (((t2Sec - t1Sec) / 3600) * cSize) + 'px',
            left: ((index) * cSize + firstColWidth) + 'px'
        };
    };

    const getTableWidth = () => {
        let tableWidthWithoutFirstColumn = (Number(options.cellSize.split('px')[0])) * (matrix[0].length - 1);
        let firstColumnWidth = (Number(options.firstColWidth.split('px')[0]));
        let scrollbarWidth = 20;
        return tableWidthWithoutFirstColumn + firstColumnWidth + scrollbarWidth;
    };

    const renderCell = (item, index) => {
        let dim = calcDim(item.start, item.end, index);
        return (
            <div
                key={Math.random()}
                className={classes.tableItem}
                style={{
                    top: dim.top,
                    left: dim.left,
                    height: dim.height,
                    width: options.cellSize,
                }}
            >
                <div
                    onClick={props.onItemClick.bind(this, item)}
                    className={classes.tableItemSelf}
                    style={{
                        backgroundColor: item.bgColor,
                        color: item.textColor,
                    }}
                >
                    {item.title}
                </div>
            </div>
        )
    };

    const handleDisplayTypeChange = activeOption => {
        if (activeOption === 'Monthly') {
            setMonthlyCalendar();
        } else setWeeklyCalendar();
        setDisplayType(activeOption);
    };

    const daysCount = displayType === 'Weekly' ? 7 : dayIndexes.length;
    const hoursCount = 24;
    const matrix = Array(hoursCount + 1).fill(Array(daysCount + 1).fill());

    const todayColumnStyle = {
        top: 0,
        left: Number(options.cellSize.split('px')[0]) * todayIndex + Number(options.firstColWidth.split('px')[0]),
        height: '100%',
        width: options.cellSize,
        backgroundColor: options.todayColumnColor,
        border: options.todayColumnCSSBorder
    };

    const handleNext = () => {
        if (displayType === 'Weekly') {
            const newData = getNextWeekDayIndexes();
            getAndSetPeriodData(newData[0], newData[newData.length - 1]);
            setDayIndexes(newData);
        } else {
            const newData = getNextMonthDayIndexes();
            setCurrentMonth(months[Number(newData[0].split('-')[1]) - 1]);
            getAndSetPeriodData(newData[0], newData[newData.length - 1]);
            setDayIndexes(newData);
        }
    };

    const handlePrev = () => {
        if (displayType === 'Weekly') {
            const newData = getPrevWeekDayIndexes();
            getAndSetPeriodData(newData[0], newData[newData.length - 1]);
            setDayIndexes(newData);
        } else {
            const newData = getPrevMonthDayIndexes();
            setCurrentMonth(months[Number(newData[0].split('-')[1]) - 1]);
            getAndSetPeriodData(newData[0], newData[newData.length - 1]);
            setDayIndexes(newData);
        }
    };

    const getNextMonthDayIndexes = () => {
        let inHandDate = new Date(dayIndexes[0]);
        inHandDate.setDate(inHandDate.getDate() + 35);
        let date = inHandDate.toISOString().split('T')[0];
        const daysCount = getDaysCount(date);
        const newDays = [];
        const startDate = date.slice(0, 7) + '-01';
        let newDate = new Date(startDate);
        for (let i = 0; i < daysCount; i++) {
            newDays.push(newDate.toISOString().split('T')[0]);
            newDate.setDate(newDate.getDate() + 1);
        }
        setTodayDate(newDays[todayIndex]);
        return newDays;
    };

    const getPrevMonthDayIndexes = () => {
        let inHandDate = new Date(dayIndexes[0]);
        inHandDate.setDate(inHandDate.getDate() - 1);
        let date = inHandDate.toISOString().split('T')[0];
        const daysCount = getDaysCount(date);
        const newDays = [];
        const startDate = date.slice(0, 7) + '-01';
        let newDate = new Date(startDate);
        for (let i = 0; i < daysCount; i++) {
            newDays.push(newDate.toISOString().split('T')[0]);
            newDate.setDate(newDate.getDate() + 1);
        }
        setTodayDate(newDays[todayIndex]);
        return newDays;
    };

    const getNextWeekDayIndexes = () => {
        const newDays = dayIndexes.map(dateString => {
            let inHandDate = new Date(dateString);
            inHandDate.setDate(inHandDate.getDate() + 7);
            return inHandDate.toISOString().split('T')[0]
        });
        setTodayDate(newDays[todayIndex]);
        return newDays;
    };

    const getPrevWeekDayIndexes = () => {
        const newDays = dayIndexes.map(dateString => {
            let inHandDate = new Date(dateString);
            inHandDate.setDate(inHandDate.getDate() - 7);
            return inHandDate.toISOString().split('T')[0]
        });
        setTodayDate(newDays[todayIndex]);
        return newDays;
    };

    const handleGoToToday = () => {
        if (displayType === 'Weekly' ) setWeeklyCalendar();
        else setMonthlyCalendar();
    };

    const setMonthlyCalendar = () => {
        let now = new Date();
        const today = now.toISOString().split('T')[0];
        const daysCount = getDaysCount(now.toISOString().split('T')[0]);
        setCurrentMonth(months[Number(now.toISOString().split('T')[0].split('-')[1])]);
        let newDays = [];
        let today_index, noIndexYet = false;
        now = new Date(now.toISOString().split('T')[0].slice(0, 7));
        for (let i = 0; i < daysCount; i++) {
            if (today === now.toISOString().split('T')[0]) {
                setTodayIndex(i);
                today_index = i;
                noIndexYet = true;

            }
            newDays.push(now.toISOString().split('T')[0]);
            now.setDate(now.getDate() + 1);
        }

        if (noIndexYet) {
            setTimeout(() => {
                setTodayDate(newDays[today_index]);
            }, 1)
        } else {
            setTodayDate(newDays[todayIndex]);
        }
        setTodayDate(newDays[todayIndex]);
        getAndSetPeriodData(newDays[0], newDays[newDays.length - 1]);
        setDayIndexes(newDays);
        setCurrentMonth(months[Number(newDays[0].split('-')[1]) - 1]);
    };

    const setWeeklyCalendar = () => {
        let now = new Date();
        const today = now.toISOString().split('T')[0];
        const weekDay = now.getDay();
        for (let i = 0; i < weekDay; i++) {
            now.setDate(now.getDate() - 1);
        }
        let newDays = [];
        let today_index, noIndexYet = false;
        for (let i = 0; i < 7; i++) {
            if (today === now.toISOString().split('T')[0]) {
                setTodayIndex(i);
                today_index = i;
                noIndexYet = true;
            }
            newDays.push(now.toISOString().split('T')[0]);
            now.setDate(now.getDate() + 1);
        }
        if (noIndexYet) {
            setTodayDate(newDays[today_index]);
        } else {
            setTodayDate(newDays[todayIndex]);
        }
        getAndSetPeriodData(newDays[0], newDays[newDays.length - 1]);
        setDayIndexes(newDays);
    };

    const getAndSetPeriodData = (start, end) => {
        setLoading(true);
        axios
            .post(props.dataUrl, {
                start_date: start,
                end_date: end,
                ...props.postData
            })
            .then(res => {
                setLoading(false);
                setData(res.data);
            }).catch(err => {
            setLoading(false);
        })
    };

    const getMonthlyCellValue = date => `${Number(date.split('-')[2])}`;

    React.useEffect(setWeeklyCalendar, []);

    return (
        <div className={classes.wrapper}>
            <div className={classes.navigation}>
                <div className={classes.navigator}>
                    <div className={classes.navigationRow}>
                        <button className={classes.today} onClick={handleGoToToday}>today</button>
                        <button className={classes.borderedButton} style={{cursor: 'pointer'}} onClick={handlePrev}>
                            <NavigateBeforeIcon style={{color: '#A4ADBA'}}/>
                        </button>
                        <button className={classes.borderedButton} style={{minWidth: 120, flex: 1}}>
                            {todayDate}
                        </button>
                        <button className={classes.borderedButton} style={{cursor: 'pointer'}} onClick={handleNext}>
                            <NavigateNextIcon style={{color: '#A4ADBA'}}/>
                        </button>
                    </div>
                    <div className={classes.navigationRow}>
                        <button
                            className={displayType === 'Weekly' ? [classes.selectButton, classes.activeSelectButton].join(' ') : classes.selectButton}
                            onClick={handleDisplayTypeChange.bind(this, 'Weekly')}>Weekly
                        </button>
                        <button
                            className={displayType === 'Monthly' ? [classes.selectButton, classes.activeSelectButton].join(' ') : classes.selectButton}
                            onClick={handleDisplayTypeChange.bind(this, 'Monthly')}>Monthly
                        </button>
                    </div>
                </div>
            </div>

            <div className={classes.table} style={{width: getTableWidth()}}>
                <table cellSpacing={0} cellPadding={0} className={classes.tableSelf}>
                    {
                        displayType === 'Weekly' ? (
                            matrix.map((row, i) => (
                                    <tr className={classes.tableRow} key={Math.random()}>
                                        {
                                            row.map((cell, j) => (
                                                    <td
                                                        key={Math.random()}
                                                        className={classes.tableCell}
                                                        style={{
                                                            '--cell-size': options.cellSize,
                                                            '--first-col-width': options.firstColWidth,
                                                            '--first-row-height': options.firstRowHeight,
                                                            '--indexes-color': options.indexesColor
                                                        }}>
                                                        {
                                                            i === 0 && j === 0 ? (
                                                                <div style={{marginTop: -10}}>
                                                                    <Loading isLoading={loading} color={'black'}/>
                                                                </div>
                                                            ) : (
                                                                j === 0 ? <small>{i}:00</small> : (
                                                                    i === 0 ? (
                                                                        <div style={{fontSize: 13, lineHeight: 2}}>
                                                                            {dayNames[j - 1]}
                                                                            <br/>
                                                                            <small style={{
                                                                                display: 'block',
                                                                                marginTop: -5,
                                                                            }}>{dayIndexes[j - 1]}</small>
                                                                        </div>

                                                                    ) : (
                                                                        // i * j
                                                                        null
                                                                    )
                                                                )
                                                            )
                                                        }
                                                    </td>
                                                )
                                            )
                                        }
                                    </tr>
                                )
                            )
                        ) : (
                            matrix.map((row, i) => (
                                    <tr className={classes.tableRow} key={Math.random()}>
                                        {
                                            row.map((cell, j) => (
                                                    <td
                                                        key={Math.random()}
                                                        className={classes.tableCell}
                                                        style={{
                                                            '--cell-size': options.cellSize,
                                                            '--first-col-width': options.firstColWidth,
                                                            '--first-row-height': options.firstRowHeight,
                                                            '--indexes-color': options.indexesColor
                                                        }}>
                                                        {
                                                            i === 0 && j === 0 ? (
                                                                <div style={{marginTop: -10}}>
                                                                    <Loading isLoading={loading} color={'black'}/>
                                                                </div>
                                                            ) : (
                                                                j === 0 ? `${i}:00` : (
                                                                    i === 0 ? getMonthlyCellValue(dayIndexes[j - 1]) : (
                                                                        // i * j
                                                                        null
                                                                    )
                                                                )
                                                            )
                                                        }
                                                    </td>
                                                )
                                            )
                                        }
                                    </tr>
                                )
                            )
                        )
                    }
                    {
                        props.highlightTodayColumn && <div className={classes.tableToday} style={todayColumnStyle}/>
                    }
                    {
                        !loading && data.map((day, index) => day.map(item => renderCell(item, index)))
                    }
                </table>
            </div>
            <div style={{height: 20}}/>
        </div>
    );
};

export default TimeTable;

TimeTable.propTypes = {
    options: Proptypes.shape({
        cellSize: Proptypes.string,
        firstColWidth: Proptypes.string,
        firstRowHeight: Proptypes.string,
        todayColumnColor: Proptypes.string,
        todayColumnCSSBorder: Proptypes.string,
        indexesColor: Proptypes.string,
    }),
    onItemClick: Proptypes.func,
    highlightTodayColumn: Proptypes.bool,
    dataUrl: Proptypes.string,
    postData: Proptypes.object,
};

TimeTable.defaultProps = {
    options: {
        cellSize: '120px',
        firstColWidth: '100px',
        firstRowHeight: '40px',
        todayColumnColor: '#d4af3755',
        todayColumnCSSBorder: '1px solid gold',
        indexesColor: '#555',
    },
    onItemClick: () => {},
    postData: {},
    highlightTodayColumn: true,
    dataUrl: ''
};
