import React, { useReducer } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import DropZone from './dragdrop';
import { storage } from '../firebase';
import styles from './uploader.module.css';

const initalState = {
  imageURL: null,
  status: 'IDLE'
};

const uploadReducer = (state, action) => {
  switch (action.type) {
    case 'PENDING':
      return {
        ...state,
        status: action.type
      };

    case 'SUCCESS':
      return {
        ...state,
        imageURL: action.value,
        status: action.type
      };
    case 'FAILURE':
      return {
        ...state,
        status: action.type
      };
    default:
      return initalState;
  }
};
const ImageUploader = () => {
  const [uploaderState, dispatch] = useReducer(uploadReducer, initalState);

  const uploadFirebase = file => {
    console.log('Started...');
    try {
      const uploadTask = storage
        .ref()
        .child(file.name)
        .put(file);

      uploadTask.on(
        'state_changed',
        snapshot => {
          let progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(progress);
        },
        err => {
          console.error('Error: ', err);
        }
      );
      uploadTask.snapshot.ref
        .getDownloadURL()
        .then(downloadUrl => {
          dispatch({
            type: 'SUCCESS',
            value: downloadUrl
          });
          console.log('Access your image at...', downloadUrl);
        })
        .catch(err => {
          console.error('Error: ', err);
          dispatch({
            type: 'FAILURE'
          });
        });
    } catch (error) {
      dispatch({
        type: 'FAILURE'
      });
    }
  };

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    dispatch({
      type: 'PENDING'
    });
    uploadFirebase(file);
  };

  const onPaste = file => onDrop([file]);

  const dispatchInitial = () =>
    dispatch({
      type: 'IDLE'
    });
  const handleSuccess = () => {
    navigator.clipboard
      .writeText(uploaderState.imageURL)
      .then(dispatchInitial)
      .catch(dispatchInitial);
  };

  return (
    <div>
      <DropZone
        onDrop={onDrop}
        onPaste={onPaste}
        accept="image/*"
        multiple={false}
      />
      {uploaderState.status === 'SUCCESS' && (
        <div>
          <SweetAlert
            success
            title="Success Data!"
            onConfirm={handleSuccess}
            customButtons={
              <React.Fragment>
                <button onClick={handleSuccess}>
                  <span role="img" aria-label="copy">
                    📋 Copy{' '}
                  </span>
                </button>
              </React.Fragment>
            }
          >
            <span role="img" aria-label="sunflower">
              🌻 Click button and get URL
            </span>
            <br /> <br />
            <textarea
              className={styles.ellipsis}
              defaultValue={uploaderState.imageURL}
              cols="50"
              readOnly
              spellCheck="false"
            />
          </SweetAlert>
        </div>
      )}

      {uploaderState.status === 'FAILURE' && (
        <div>
          <SweetAlert
            danger
            title="Error Occured!"
            onConfirm={dispatchInitial}
            customButtons={
              <React.Fragment>
                <button className={styles.button} onClick={handleSuccess}>
                  Cancel
                </button>
              </React.Fragment>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
