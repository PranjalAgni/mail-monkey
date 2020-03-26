import React from 'react';
import ImageUploader from '../components/uploader';

import '../global.css';

export default () => {
  return (
    <div>
      <h1>Upload or paste image and get URL</h1>
      <ImageUploader />
    </div>
  );
};
