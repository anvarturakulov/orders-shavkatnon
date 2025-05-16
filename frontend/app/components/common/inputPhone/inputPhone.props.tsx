import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputPhoneProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    phone: string,
    setPhone: Function,
    label: string,
    visible?: boolean,
}