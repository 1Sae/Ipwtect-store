export const generateReferralCode = (name = "") => {
    const prefix = name ? name.slice(0, 3).toUpperCase() : "USR";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
};  