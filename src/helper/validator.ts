export const validateEmail = (email: string): boolean =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const validatePassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?_\-*/.\\#\s]).{8,}$/.test(password);
