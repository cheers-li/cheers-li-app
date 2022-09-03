export const validateEmail = (email: string): boolean =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
