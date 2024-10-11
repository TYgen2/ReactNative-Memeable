import admin from "firebase-admin";
import serviceAccount from "../memeable-fc76d-firebase-adminsdk-gp36d-244c2c31b2.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
