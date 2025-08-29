export const AUTH_MESSAGES = {
    REGISTER: {
        SUCCESS_MESSAGE: "נרשמת בהצלחה למערכת!",
        ERROR_MESSAGES: {
            EXISTING_USER: 'משתמש כבר קיים במערכת',
            INVALID_PASSWORD_REGEX: "הסיסמה חייבת להכיל שמונה תווים לפחות ולכלול אותיות ומספרים בלבד",
            INVALID_NAME_REGEX: "שם חייב להכיל שני תווים לפחות ולכלול אותיות בלבד",
            INVALID_USERNAME_REGEX: "שם משתמש חייב להכיל שלושה תווים לפחות ולכלול אותיות ומספרים בלבד",
            UNMATCHED_PASSWORDS: "סיסמאות לא תואמות"
        }
    },
    LOGIN: {
        WRONG_DETAILS: 'אחד או יותר מהפרטים שהזנת שגויים'
    },
    EMPTY_FORM_FIELDS: "יש למלא את כל השדות"
}