export const isStrongPassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
};  