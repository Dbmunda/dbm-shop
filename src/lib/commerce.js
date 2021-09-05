import Commerce from '@chec/commerce.js';

export const commerce = new Commerce(process.env.REACT_APP_API_KEY, true);
//export const commerce = new Commerce(CHEC_PUBLIC_API_KEY, true);