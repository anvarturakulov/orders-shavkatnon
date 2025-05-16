import axios from 'axios';
import { showMessage } from './showMessage';

export const loginToApp = (body: any, setMainData: Function | undefined) => {
  const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/login';
  axios.post(uri, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      setMainData && setMainData('user', response.data);
      // showMessage('Малумотлар келди', 'success', setMainData)
    })
    .catch(function (error) {
      if (setMainData) {
        if (error.response.status == 401) {
          showMessage('Фойдаланувчи маълумотлари хато киритилди', 'error', setMainData)
        } else {
          showMessage(error.message+'dddd', 'error', setMainData)
        }
      }
    });
}