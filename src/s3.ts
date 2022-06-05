import { Upload } from '@aws-sdk/lib-storage';
import { S3, Tag } from '@aws-sdk/client-s3';
import { PutObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
import { PutObjectRequest } from '@aws-sdk/client-s3/dist-types/models/models_0';

/**
 * Push zambda generated zip to S3 bucket
 *
 * @param s3 client to use
 * @param bucket to push zip in
 * @param key in S3 bucket
 * @param body zip file
 * @param tags to put along file in S3
 * @param queueSize to use with multiple part upload client
 * @param partSize to use with multiple part upload client
 */
export async function pushS3(
  s3: S3,
  bucket: string,
  key: string,
  body: PutObjectRequest['Body'] | string | Uint8Array | Buffer,
  tags: Tag[] = [],
  queueSize = 2,
  partSize = 1,
): Promise<boolean> {
  try {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: body,
    };
    const parallelUploads3 = new Upload({
      client: s3,
      tags: [...tags], // optional tags
      queueSize, // optional concurrency configuration
      partSize, // optional size of each part in MB
      leavePartsOnError: false, // optional manually handle dropped parts
      params,
    });
    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });
    return parallelUploads3.done().then(() => true);
  } catch (e) {
    console.log(e);
    return false;
  }
}
