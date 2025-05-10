import { DetailedHTMLProps, InputHTMLAttributes } from "react";
export type ValuesToJournalCheckboxs = 'charges' | 'workers' | 'partners'

export interface CheckBoxInFooterProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: ValuesToJournalCheckboxs,
    label: string,
}
