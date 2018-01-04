import { ServiceAccount } from "firebase-admin";

type privateCredentials = {
  client_secret: string,
  firebase: {
    databaseURL: string,
    serviceAccount: ServiceAccount & any,
  },
};

export const credentials: privateCredentials = {
  client_secret: "",
  firebase: {
    databaseURL: "",
    // Firebase.
    serviceAccount: {
      auth_provider_x509_cert_url: "",
      auth_uri: "",
      client_email: "",
      client_id: "",
      client_x509_cert_url: "",
      private_key: "",
      private_key_id: "",
      project_id: "",
      token_uri: "",
      type: "",
    },
  },
};
