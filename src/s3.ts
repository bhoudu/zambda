import { Upload } from "@aws-sdk/lib-storage";
import { S3, Tag } from "@aws-sdk/client-s3";

export async function push(
  s3: S3,
  bucket: string,
  key: string,
  body: string | Uint8Array | Buffer,
  tags: Tag[] = [],
  queueSize: number = 4,
  partSize: number = 5,
): Promise<boolean> {
  try {
    const parallelUploads3 = new Upload({
      client: s3,
      tags: [...tags], // optional tags
      queueSize, // optional concurrency configuration
      partSize, // optional size of each part in MB
      leavePartsOnError: false, // optional manually handle dropped parts
      params: {
        Bucket: bucket,
        Key: key,
        Body: body,
      },
    });
    parallelUploads3.on(
      "httpUploadProgress",
      (progress) => {
        console.log(progress);
      }
    );
    return parallelUploads3
      .done()
      .then(() => true);
  } catch (e) {
    console.log(e);
    return false;
  }
}
