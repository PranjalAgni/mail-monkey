import axios from 'axios';

const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:4040'
    : 'https://gatsby-mailer-backend.now.sh';

const decideAndFireRequest = (formState, successCb, errorCb) => {
  const requestConfig = {
    url: '/api/sendgrid',
    body: JSON.stringify(formState)
  };

  if (formState.attachment) {
    // Send to Node server
    const formData = new FormData();
    const keys = Object.keys(formState);

    keys.forEach(key => {
      formData.append(key, formState[key]);
    });

    requestConfig['url'] = `${API_URL}/api/mailer/send`;
    requestConfig['body'] = formData;
  }

  axios
    .post(requestConfig.url, requestConfig.body)
    .then(successCb)
    .catch(errorCb);
};

export default decideAndFireRequest;
