import NodeRSA from "node-rsa";

export const resDecrypt = (json, key) => {
  let privateKey = new NodeRSA(key);
  let decrypted = privateKey.decrypt(json, "json");
  return decrypted;
};

export const rsaKeys = () => {
  const keys = new NodeRSA({ b: 2048 });
  const publicKey = keys.exportKey("public");
  const privateKey = keys.exportKey("private");
  return {
    publicKey,
    privateKey,
  };
};
