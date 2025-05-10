import { SpinnerProps } from "./spinner.props";
import styles from './spinner.module.css';
import { useAppContext } from '@/app/context/app.context';
import Image from "next/image";

export const Spinner = ({className, ...props}: SpinnerProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext()

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