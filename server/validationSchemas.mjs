export const createUserValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "email cannnot be empty",
    },
    isEmail: {
      errorMessage: "incorrect email format",
    },
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 6, max: 32 },
      errorMessage: "password should be in length between 6-32",
    },
    isString: {
      errorMessage: "password have to be string",
    },
  },
  displayName: {
    isLength: {
      options: { min: 4, max: 32 },
      errorMessage: "display name should be in length between 4-32",
    },
    notEmpty: {
      errorMessage: "display name cannnot be empty",
    },
  },
  googleId: {
    optional: true,
    isString: {
      errorMessage: "googleId have to be string",
    },
  },
  facebookId: {
    optional: true,
    isString: {
      errorMessage: "facebookId have to be string",
    },
  },
  authMethod: {
    notEmpty: {
      errorMessage: "authMethod cannnot be empty",
    },
    isString: {
      errorMessage: "authMethod have to be string",
    },
    isIn: {
      options: [["local", "google", "facebook"]],
      errorMessage: "authMethod must be either local, google or facebook",
    },
  },
};
