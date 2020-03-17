import React, { useReducer } from 'react';
import styles from './form.module.css';

const initalState = {
  name: '',
  email: '',
  subject: '',
  body: '',
  status: 'IDLE'
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.key]: action.value
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        status: action.value
      };
    case 'RESET':
    default:
      return initalState;
  }
};
const Form = () => {
  const [formState, dispatch] = useReducer(formReducer, initalState);

  const handleSubmit = event => {
    event.preventDefault();
    console.log('Form submitted: ', formState);
    sendMail();
  };

  const sendMail = () => {
    dispatch({
      type: 'UPDATE_STATUS',
      value: 'PENDING'
    });

    fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify(formState)
    })
      .then(res => res.json())
      .then(res => {
        console.log('Response: ', res);
        dispatch({
          type: 'UPDATE_STATUS',
          value: 'SUCCESS'
        });
      })
      .catch(err => {
        console.error(err);
        dispatch({
          type: 'UPDATE_STATUS',
          value: 'ERROR'
        });
      });
  };

  const updateFieldValue = field => event =>
    dispatch({
      type: 'UPDATE_INPUT',
      key: field,
      value: event.target.value
    });

  if (formState.status === 'SUCCESS') {
    return (
      <div className={styles.success}>
        <h1>
          Sent{' '}
          <span role="img" aria-labelledby="smiling">
            😀
          </span>
        </h1>
        <button
          className={`${styles.button} ${styles.centered}`}
          type="reset"
          onClick={() => dispatch({ type: 'RESET' })}
        >
          RESET
        </button>
      </div>
    );
  }
  return (
    <>
      {formState.status === 'ERROR' && (
        <p className={styles.error}>
          Something went wrong, please try again later
        </p>
      )}
      <form
        className={`${styles.form} ${formState.status === 'PENDING' &&
          styles.pending}`}
        onSubmit={handleSubmit}
      >
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formState.name}
            onChange={updateFieldValue('name')}
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formState.email}
            onChange={updateFieldValue('email')}
          />
        </label>
        <label className={styles.label}>
          Subject
          <input
            className={styles.input}
            type="text"
            name="subject"
            value={formState.subject}
            onChange={updateFieldValue('subject')}
          />
        </label>
        <label className={styles.label}>
          Body
          <textarea
            className={styles.input}
            name="body"
            value={formState.body}
            onChange={updateFieldValue('body')}
          />
        </label>
        <button className={styles.button}>Send</button>
      </form>
    </>
  );
};

export default Form;
