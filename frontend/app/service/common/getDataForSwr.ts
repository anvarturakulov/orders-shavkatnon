export const getDataForSwr = async (url: string, token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true', }
  };
  const response = await fetch(url, config);
  return await response.json();
};
