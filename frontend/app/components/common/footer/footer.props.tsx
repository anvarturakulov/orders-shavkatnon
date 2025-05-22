import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface FooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  windowFor: 'orders' | 'cash' | 'sales',
  count?: number,
  total?: number,
  docCount?: number,
}