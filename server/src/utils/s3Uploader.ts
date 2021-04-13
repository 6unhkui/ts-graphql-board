import AWS from "aws-sdk";
import { Stream } from "node:stream";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

export const s3Uploader = (fileStream: Stream, fileName: string): Promise<AWS.S3.ManagedUpload.SendData> => {
    const params = {
        Bucket: process.env.S3_BUCKET || "board-app-s3",
        Key: `original/${fileName}`,
        Body: fileStream,
        ACL: "public-read",
        ContentType: "image/jpg"
    };

    return s3.upload(params).promise();
};
