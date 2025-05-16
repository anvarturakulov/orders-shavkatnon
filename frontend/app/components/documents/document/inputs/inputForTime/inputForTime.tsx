import { InputForTimeProps } from './inputForTime.props';
import styles from './inputForTime.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';

export const InputForTime = ({ label, id, className, ...props }: InputForTimeProps): JSX.Element => {
    const { mainData, setMainData } = useAppContext();
    const { currentDocument } = mainData.document;

    // Функция парсинга времени
    const parseTimeString = (input: string | number | undefined): string => {
        if (!input) return '';

        let date: Date;

        if (typeof input === 'number') {
            // Если входное значение — Unix-время в секундах
            date = new Date(input * 1000);
        } else {
            // Если строка
            if (input.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
                // Формат "HH:mm" или "HH:mm:ss"
                return input.split(':').slice(0, 2).join(':');
            }
            // ISO или другие форматы
            date = new Date(input);
        }

        if (isNaN(date.getTime())) {
            console.warn(`Invalid time format: ${input}`);
            return '';
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Получить начальное значение
    const takingTime = currentDocument.docValues.orderTakingTime
        ? parseTimeString(currentDocument.docValues.orderTakingTime)
        : '';

    let currentVal = id === 'orderTakingTime' ? takingTime : '';

    const changeElements = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata) => {
        let { currentDocument } = mainData.document;
        let target = e.currentTarget;
        let value = target.value; // Значение в формате HH:mm
        console.log('New time value:', value);

        let newObj = {};

        if (target.id === 'orderTakingTime') {
            newObj = {
                ...currentDocument,
                docValues: {
                    ...currentDocument.docValues,
                    orderTakingTime: value, // Сохраняем в формате HH:mm
                },
            };
        }

        if (setMainData) {
            setMainData('currentDocument', { ...newObj });
        }
    };

    return (
        <div className={styles.box}>
            {label !== '' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input)}
                onChange={(e) => changeElements(e, setMainData, mainData)}
                type="time"
                value={currentVal}
                id={id}
                {...props}
            />
        </div>
    );
};