import React from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './dragdrop.module.css';

const DropZone = ({ onDrop, onPaste, accept, multiple }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  const handlePaste = e => {
    const items = e.clipboardData.items;
    if (items[1] && items[1].kind === 'file') {
      const blob = items[1].getAsFile();
      onPaste(blob);
    }
  };

  return (
    <div {...getRootProps()} onPaste={handlePaste}>
      <input className={styles.dropinput} {...getInputProps()} />
      <div className={styles.dropbody}>
        {isDragActive ? (
          <p className={styles.dropcontent}>Release to drop a file here</p>
        ) : (
          <p className={styles.dropcontent}>
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
    </div>
  );
};

export default DropZone;
