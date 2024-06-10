import { google } from 'googleapis';

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const googleCallbackUrl = `${process.env.DEV_URL}/v1/auth/google/callback`;

const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret, googleCallbackUrl);
const scopes = [process.env.SCOPE_USERINFO_EMAIL as string, process.env.SCOPE_USERINFO_PROFILE as string];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});

export { oauth2Client, authorizationUrl };
