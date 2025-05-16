import { useState } from 'react';
import styles from './inputPhone.module.css';
import { InputPhoneProps } from './inputPhone.props';

export const InputPhone = ({ phone, setPhone, label, visible=true, className, ...props }: InputPhoneProps): JSX.Element => {
  

  const formatPhoneNumber = (value:string) => {
    // Удаляем всё, кроме цифр
    const digits = value.replace(/\D/g, '');
    // Ограничиваем до 9 цифр (2 для кода + 7 для номера)
    const limitedDigits = digits.slice(0, 9);

    // Форматируем номер
    let formatted = '';
    if (limitedDigits.length > 0) {
      formatted = `(${limitedDigits.slice(0, 2)}`;
    }
    if (limitedDigits.length > 2) {
      formatted += `) ${limitedDigits.slice(2, 5)}`;
    }
    if (limitedDigits.length > 5) {
      formatted += `-${limitedDigits.slice(5, 7)}`;
    }
    if (limitedDigits.length > 7) {
      formatted += `-${limitedDigits.slice(7, 9)}`;
    }

    return formatted;
  };

  const handleChange = (event:React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setPhone(formattedValue);
  };

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только цифры, Backspace, стрелки и т.д.
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="phone" className={styles.label}>
        Мижоз телефон раками
      </label>
      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="(__) ___-__-__"
        className={styles.input}
        maxLength={14}
        required
      />
    </div>
  );
}