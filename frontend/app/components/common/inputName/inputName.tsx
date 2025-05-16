import styles from './inputName.module.css';
import { InputNameProps } from './inputName.props';

export const InputName = ({ name, setName, label, visible=true, className, ...props }: InputNameProps): JSX.Element => {

  const handleChange = (event:React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    setName(inputValue);
  };

  return (
    <div className={styles.container}>
      {/* <label htmlFor="phone" className={styles.label}>
        Мижоз исми
      </label> */}
      <input
        type="text"
        id="name"
        value={name}
        placeholder='Мижоз исми'
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
}