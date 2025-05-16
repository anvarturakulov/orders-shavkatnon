import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputNameProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    name: string,
    setName: Function,
    label: string,
    visible?: boolean,
}