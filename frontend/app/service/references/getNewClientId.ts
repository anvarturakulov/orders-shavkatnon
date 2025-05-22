import axios from 'axios';
import { showMessage } from '../common/showMessage';

export const getNewClientId = async (
  name: string,
  phone: string,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  if (!phone) {
    showMessage('Phone number is required', 'error', setMainData);
    return;
  }

  if (!name) {
    showMessage('Name is required', 'error', setMainData);
    return;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  };

  const body = {
    name,
    phone
  }
  try {
    const uri = `${process.env.NEXT_PUBLIC_DOMAIN}/api/references/getNewClientId/`;
    const response = await axios.post(uri, body, config);
    const clientId = response.data;
    return clientId; 
  } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch client';
      showMessage(errorMessage, 'error', setMainData);
      throw error; 
  }
};