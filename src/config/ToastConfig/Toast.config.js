import React from 'react';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastConfig = {
    autoClose: 6000,
    pauseOnHover: true,
    enableMultiContainer: true,
    position: toast.POSITION.TOP_CENTER
};
export const Toast = (msg, type) => {
    msg = <div style={{direction: 'ltr', textAlign: 'left'}}>{msg}</div>;
    switch (type) {
        case 'success':
            toast.success(msg, ToastConfig);
            break;
        case 'info':
            toast.info(msg, ToastConfig);
            break;
        case 'warning':
            toast.warn(msg, ToastConfig);
            break;
        case 'error':
            toast.error(msg, ToastConfig);
            break;
        default:
            toast.error(msg, ToastConfig);
    }
};
