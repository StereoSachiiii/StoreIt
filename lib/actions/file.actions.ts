"use server"
import {UploadFileProps} from "@/lib/actions/types"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { ID } from "node-appwrite"
import { getFileType } from "../utils"
// import { buffer } from "stream/consumers" // Removed unused import


// Helper function to construct file URL
const constructFileUrl = (fileId: string) =>
    `${appwriteConfig.endPointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;

export const uploadFile = async ({ file, ownerId, accountId }: UploadFileProps) => {

    const { storage, databases } = await createAdminClient();

    try {
        // Assuming file is a File, Blob, or Buffer object with a 'name' property
        const inputFile = file; // Appwrite storage.createFile accepts Blob, File, or Buffer

        const bucketFile = await storage.createFile({
            bucketId: appwriteConfig.bucketId,
            fileId: ID.unique(),
            file: inputFile
        });

        const fileTypeInfo = getFileType(bucketFile.name);

        const fileDocument = {
            type: fileTypeInfo.fileType,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: fileTypeInfo.extension,
            owner: ownerId,
            accountId,
            users: [],
            bucketFieldId: bucketFile.$id,
        };

        await databases.createDocument({
            databaseId: appwriteConfig.databaseId,
            collectionId: appwriteConfig.filesCollection,
            documentId: ID.unique(),
            data: fileDocument,
        }).catch(
            async () => {
                await storage.deleteFile({
                    bucketId: appwriteConfig.bucketId,
                    fileId: bucketFile.$id
                });
            }
        );
    } catch (error) {
        // Handle error if needed
        throw error;
    }
}



 
