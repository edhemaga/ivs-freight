export const getStringFromBase64 = (url: string) => {
  return url.split(',')[1];
};

export const createBase64 = (url: string) => {
  return `data:image/*;base64,${url}`;
};
