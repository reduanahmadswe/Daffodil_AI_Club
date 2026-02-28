import { Readable } from 'stream';
import { google } from 'googleapis';
import { env } from '../../config/env.js';

interface UploadInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

class MediaService {
  private getDriveClient() {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) {
      throw new Error('Google Drive OAuth2 credentials are not configured. Run "node setup-drive-token.js" first.');
    }

    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `http://localhost:${env.PORT}/api/media/oauth2callback`
    );

    oauth2Client.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  async uploadFileToDrive(input: UploadInput) {
    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error('Google Drive folder is not configured');
    }

    const drive = this.getDriveClient();

    const fileResponse = await drive.files.create({
      requestBody: {
        name: input.filename,
        mimeType: input.mimeType,
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: input.mimeType,
        body: Readable.from(input.buffer),
      },
      fields: 'id,name,mimeType',
    });

    const fileId = fileResponse.data.id;

    if (!fileId) {
      throw new Error('Failed to upload file to Google Drive');
    }

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      id: fileId,
      name: fileResponse.data.name,
      mimeType: fileResponse.data.mimeType,
      openUrl: `https://drive.google.com/open?id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  }

  async uploadImageToDrive(input: UploadInput) {
    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
      throw new Error('Google Drive folder is not configured');
    }

    const drive = this.getDriveClient();

    const fileResponse = await drive.files.create({
      requestBody: {
        name: input.filename,
        mimeType: input.mimeType,
        parents: [env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: input.mimeType,
        body: Readable.from(input.buffer),
      },
      fields: 'id,name,mimeType',
    });

    const fileId = fileResponse.data.id;

    if (!fileId) {
      throw new Error('Failed to upload image to Google Drive');
    }

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      id: fileId,
      name: fileResponse.data.name,
      mimeType: fileResponse.data.mimeType,
      openUrl: `https://drive.google.com/open?id=${fileId}`,
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    };
  }
}

export const mediaService = new MediaService();
