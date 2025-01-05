import { google } from "googleapis";
import { load } from "ts-dotenv";

export const env = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_PASSWORD: String,
  GOOGLE_REDIRECT_URI: String,
});

export const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_PASSWORD,
  env.GOOGLE_REDIRECT_URI
);
