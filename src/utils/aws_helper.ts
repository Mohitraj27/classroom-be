import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const fileKey = `${folder}/${uuidv4()}-${file.originalname}`;

  await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    .promise();

  const filePath = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  return filePath;
};
