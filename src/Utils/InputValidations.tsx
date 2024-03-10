export const emailValidation = {
  required: "Email Is Required",
  pattern: {
    value:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    message: "Email Is Invalid",
  },
};

export const passwordValidation = {
  required: "Password Is Required",
  pattern: {
    value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* )/,
    message:
      "Password must contain at least one digit, lowercase letter, uppercase letter, special character",
  },
  minLength: {
    value: 6,
    message: "Minimum length should be 6 characters",
  },
  maxLength: {
    value: 16,
    message: "Maximum length exceeded 16",
  },
};

export const userNameValidation = {
  required: "User Name is Required",
  pattern: {
    value: /[A-Za-z]{4,7}[\d]{1}/gm,
    message:
      "The user name must contain characters and end with numbers without spaces.",
  },
  maxLength: {
    value: 8,
    message: "The user name may not be greater than 8 characters.",
  },
  minLength: {
    value: 4,
    message: "The user name must be at least 4 characters.",
  },
};

export const phoneNumberValidation = {
  required: "Phone Number is required",
  pattern: {
    value: /^01[0-2,5]{1}[0-9]{8}$/,
    message: "Invalid phone number format (01XXXXXXXXX)",
  },
};
export const otpValidation = {
  required: "OTP is required",
  minLength: {
    value: 4,
    message: "OTP must be exactly 4 characters long",
  },
  maxLength: {
    value: 4,
    message: "OTP must be exactly 4 characters long",
  },
};
