import { SpinnerProps } from "./spinner.props";
import styles from './spinner.module.css';
import Image from "next/image";

export const Spinner = ({className, ...props}: SpinnerProps): JSX.Element => {

    return (
        <div className={styles.container}>
            <Image
                src="/loading.gif"
                alt="loading"
                layout="fill"
                objectFit="contain" // Для сохранения пропорций
            />
        </div>
    )
}