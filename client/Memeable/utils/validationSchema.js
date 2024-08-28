import * as yup from "yup";

export const loginReviewSchema = yup.object({
  email: yup.string().email().required("Email is requried"),
  password: yup.string().required("Password is requried"),
});

export const registerReviewSchema = yup.object({
  displayName: yup.string().required("Display name is requried").min(4).max(32),
  email: yup.string().email().required("Email is requried"),
  password: yup.string().required("Password is requried").min(6).max(32),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Passwords do not match"),
});
