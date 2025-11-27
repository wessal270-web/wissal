
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- CLOUDFLARE R2 CONFIGURATION ---
const R2_ACCOUNT_ID = "59555fce72fde7782d61c58691a3e64c";
const ACCESS_KEY_ID = "947de09ef48078bc9e169f7a8bf93517";
const SECRET_ACCESS_KEY = "5f89b56c9162150991ce561fc26149b06f6b38cd2e882b68547a205c89e86f05";
const BUCKET_NAME = "asslogo";
const PUBLIC_DOMAIN = "https://pub-c2a233f9dcb748d6ab9b21ce85b07126.r2.dev";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log("Attempting upload to Cloudflare R2...");
    
    // Dynamic import to prevent app crash if SDK fails to load in browser
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    // Initialize S3 Client for Cloudflare R2
    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
    
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const key = `logos/${filename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    await S3.send(command);

    // Construct Public URL
    const domain = PUBLIC_DOMAIN.replace(/\/$/, "");
    const publicUrl = `${domain}/${key}`;

    console.log(`R2 Upload Success: ${publicUrl}`);
    return publicUrl;

  } catch (error: any) {
    console.warn("Cloudflare R2 upload failed (likely CORS or network), falling back to Firebase Storage.", error);
    
    // Fallback to Firebase
    try {
        return await uploadToFirebase(file);
    } catch (fbError: any) {
        console.error("All upload methods failed:", fbError);
        throw new Error("فشل رفع الصورة. يرجى التحقق من الاتصال بالإنترنت.");
    }
  }
};

const uploadToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `logos/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}
