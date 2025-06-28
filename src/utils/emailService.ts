import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
import { CustomError } from "@/utils/custom_error";
import   messages  from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import { SendEmailParams } from '@/modules/user/user.types';

AWS.config.update({
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, 
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

export const sendEmail = async ( emailParams: SendEmailParams) => {
  const params = {
    Destination: {
      ToAddresses: [emailParams.to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailParams.html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailParams.subject,
      },
    },
    Source: process.env.SES_SENDER_EMAIL || '',
  };

  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw new CustomError(messages.ERROR_SENDING_EMAIL, statusCodes.INTERNAL_SERVER_ERROR, error);
   }
};
