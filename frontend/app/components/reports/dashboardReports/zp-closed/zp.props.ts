import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../inform.props';

export interface ZpProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: any;
  currentSection?: string
}