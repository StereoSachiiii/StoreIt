"use server"
import { UploadFileProps } from "@/lib/actions/types"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { ID, Query } from "node-appwrite"
import { getFileType, parseStringify } from "../utils"
import { getCurrentUser } from "./user.actions"
import { revalidatePath } from "next/cache"
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies"


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
  return [
    Query.or([
      Query.equal("accountId", currentUser.accountId),
Query.or([
  Query.equal("accountId", currentUser.accountId),
  Query.contains("users", [currentUser.accountId])
])
    ])
  ]
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


export const renameFile = async ({ fileId, name, extension, path }:any) => {
  try {
    const { databases } = await createAdminClient() // CALL the function

    // Use dot instead of comma for filename
    const newName = `${name}.${extension}`

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId,
      {
        name: newName
      }
    )

    // Revalidate the page/path after update
    revalidatePath(path)

    return parseStringify(updatedFile)
  } catch (error) {
    console.error("Failed to rename the file:", error)
    throw error // propagate error if needed
  }
}

export const deleteFile = async ({fileId,path}:any) =>{

  const {databases,storage} = await createAdminClient()
await storage.deleteFile(appwriteConfig.bucketId, fileId)

await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollection,
    fileId
)

revalidatePath(path)
}

export const shareFileWithUser = async ({
  fileId,
  targetEmail,
  path
}: {
  fileId: string
  targetEmail: string
  path?: string
}) => {
  try {
    const { databases } = await createAdminClient()

   const targetUsers = await databases.listDocuments(
  appwriteConfig.databaseId,
  appwriteConfig.usersCollection,
  [
    Query.equal("email", targetEmail)
  ]
);
  const targetUserId = targetUsers.documents[0].accountId

    // 1️⃣ Fetch current file document
    const fileDoc = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId
    )

    // 2️⃣ Add target user to users array (if not already included)
    const updatedUsers = Array.from(new Set([...(fileDoc.users || []), targetUserId]))

    // 3️⃣ Update the document
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId,
      { users: updatedUsers }
    )

    if (path) revalidatePath(path)

    return parseStringify(updatedFile)
  } catch (error) {
    console.error("Error sharing file:", error)
    throw error
  }
}
