"use server"
import { UploadFileProps } from "@/lib/actions/types"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { ID, Query } from "node-appwrite"
import { getFileType, parseStringify } from "../utils"
import { getCurrentUser } from "./user.actions"


export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

    
  // Debug: Check what we received
  console.log("Upload params:", { 
    ownerId, 
    accountId, 
    hasFile: !!file,
    accountIdType: typeof accountId,
    accountIdValue: accountId 
  });

  try {
    // Get the user document $id for the relation
    const userDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollection,
      [Query.equal('accountId', accountId)]
    );

    if (userDoc.documents.length === 0) {
      throw new Error('User not found in database');
    }

    const userDocId = userDoc.documents[0].$id;

    const constructFileUrl = (fileId: string) =>
      `${appwriteConfig.endPointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;

    // 1️⃣ Upload the file
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    // 2️⃣ Create metadata document
    const fileTypeInfo = getFileType(bucketFile.name);

const fileDocument = {
  name: bucketFile.name,
  url: constructFileUrl(bucketFile.$id),
  type: fileTypeInfo.fileType,
  bucketField: bucketFile.$id,
  accountId: accountId,
  user: userDocId,  // Use document $id for relation
  users: [accountId],
};

    // Debug: Check what we're sending
    console.log("Creating document with:", fileDocument);
    console.log("accountId specifically:", fileDocument.accountId);

    const createdDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      ID.unique(),
      fileDocument,
    );

    console.log("Document created successfully:", createdDocument.$id);

    // Return the created document info
    return parseStringify(createdDocument);
  } catch (error) {
    console.error("Upload error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};


const createQueries = (currentUser: any) => {
  const queries = [
    Query.or([
      Query.equal('accountId', currentUser.accountId),
      Query.equal('user', currentUser.$id)
    ])
  ]
  return queries
}


export const getfiles = async () => {
  const { databases } = await createAdminClient();

  if (!databases) {
    throw new Error("error getting databases client");
  }

  try {
    // Get current user's details
    const currentUser = await getCurrentUser();
    // Debug

    // User doesn't exist
    if (!currentUser) {
      throw new Error("user not found");
    }

    const queries = createQueries(currentUser);

    // Use Appwrite's new listDocuments method
    const userFiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      queries
    );
    console.log("users files",userFiles);

    return userFiles;
  } catch (err) {
    console.log(err, "error fetching files from files collection");
    throw err;
  }
};