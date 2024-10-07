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

export const createPostValidationSchema = {
  title: {
    optional: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "Title length should not exceeds 100 characters",
    },
  },
  description: {
    optional: true,
    isLength: {
      options: { max: 1000 },
      errorMessage: "Description length should not exceeds 1000 characters",
    },
  },
  hashtag: {
    optional: true,
  },
};

export const updateProfileValidationSchema = {
  username: {
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value !== undefined) {
          if (value.trim() === "") {
            throw new Error("Username cannot be empty");
          }
          if (value.length < 6) {
            throw new Error(
              "Username length should not less than 6 characters"
            );
          }
          if (value.length > 16) {
            throw new Error("Username length should not exceed 16 characters");
          }
        }
        return true;
      },
    },
  },
  displayName: {
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value !== undefined) {
          if (value.trim() === "") {
            throw new Error("Display name cannot be empty");
          }
          if (value.length < 4) {
            throw new Error(
              "Display name length should not less than 4 characters"
            );
          }
          if (value.length > 32) {
            throw new Error(
              "Display name length should not exceed 32 characters"
            );
          }
        }
        return true;
      },
    },
  },
  userBio: {
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value !== undefined && value.length > 150) {
          throw new Error(
            "Personal bio length should not exceed 150 characters"
          );
        }
        return true;
      },
    },
  },
};
