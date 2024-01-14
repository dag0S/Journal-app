import styles from './JournalForm.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { useContext, useEffect, useReducer, useRef } from 'react';
import cn from 'classnames';
import { INITIAL_STATE, formReducer } from './JournalForm.state';
import { UserContext } from '../../context/user.context';

const JournalForm = ({ onSubmit, data, onDelete }) => {
  const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
  const { isValid, isFormReadyToSubmit, values } = formState;

  const titleRef = useRef();
  const dateRef = useRef();
  const postRef = useRef();

  const { userId } = useContext(UserContext);

  const focusError = isValid => {
    switch (true) {
      case !isValid.title:
        titleRef.current.focus();
        break;
      case !isValid.date:
        dateRef.current.focus();
        break;
      case !isValid.post:
        postRef.current.focus();
        break;
    }
  };

  useEffect(() => {
    if (!data) {
      dispatchForm({ type: 'CLEAR' });
      dispatchForm({
        type: 'SET_VALUE',
        payload: { userId },
      });
    }
    dispatchForm({
      type: 'SET_VALUE',
      payload: { ...data },
    });
  }, [data]);

  useEffect(() => {
    let timerId;
    if (!isValid.date || !isValid.title || !isValid.post) {
      focusError(isValid);
      timerId = setTimeout(() => {
        dispatchForm({ type: 'RESET_VALIDITY' });
      }, 2000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isValid]);

  useEffect(() => {
    if (isFormReadyToSubmit) {
      onSubmit(values);
      dispatchForm({ type: 'CLEAR' });
      dispatchForm({
        type: 'SET_VALUE',
        payload: { userId },
      });
    }
  }, [isFormReadyToSubmit, values, onSubmit, userId]);

  useEffect(() => {
    dispatchForm({
      type: 'SET_VALUE',
      payload: { userId },
    });
  }, [userId]);

  const onChange = e => {
    dispatchForm({
      type: 'SET_VALUE',
      payload: { [e.target.name]: e.target.value },
    });
  };

  const addJournalItem = e => {
    e.preventDefault();
    dispatchForm({ type: 'SUBMIT' });
  };

  const deleteJournalItem = () => {
    onDelete(data.id);
    dispatchForm({ type: 'CLEAR' });
    dispatchForm({
      type: 'SET_VALUE',
      payload: { userId },
    });
  };

  return (
    <form className={styles['jornal-form']} onSubmit={addJournalItem}>
      <div className={styles['form-row']}>
        <Input
          type="text"
          ref={titleRef}
          name="title"
          value={values.title}
          onChange={onChange}
          appearence="title"
          isValid={isValid.title}
        />
        {data?.id && (
          <button
            className={styles.delete}
            type="button"
            onClick={deleteJournalItem}
          >
            <img src="/archive.svg" alt="archive" />
          </button>
        )}
      </div>
      <div className={styles['form-row']}>
        <label htmlFor="date" className={styles['form-label']}>
          <img src="/calendar.svg" alt="" />
          <span>Дата</span>{' '}
        </label>
        <Input
          type="date"
          ref={dateRef}
          name="date"
          id="date"
          value={
            values.date ? new Date(values.date).toISOString().slice(0, 10) : ''
          }
          onChange={onChange}
          isValid={isValid.date}
        />
      </div>
      <div className={styles['form-row']}>
        <label htmlFor="tag" className={styles['form-label']}>
          <img src="/folder.svg" alt="" />
          <span>Метки</span>{' '}
        </label>
        <Input
          type="text"
          id="tag"
          name="tag"
          value={values.tag}
          onChange={onChange}
        />
      </div>
      <textarea
        name="post"
        ref={postRef}
        id=""
        cols="30"
        rows="10"
        className={cn(styles['input'], {
          [styles.invalid]: !isValid.post,
        })}
        value={values.post}
        onChange={onChange}
      ></textarea>
      <Button>Сохранить</Button>
    </form>
  );
};

export default JournalForm;
