"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";


// ==================== HELPER FUNCTIONS ====================

// Get user from DB by email
const getUserByEmail = async (email: string) => {
  console.log("🔍 [getUserByEmail] Looking up email:", email);
  
  try {
    const { tablesDB } = await createAdminClient();
    
    const result = await tablesDB.listRows(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollection,
      [`equal("email", ["${email}"])`]
    );
    
    console.log("📦 [getUserByEmail] Found:", result.rows.length > 0);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("💥 [getUserByEmail] ERROR:", error);
    return null;
  }
};

// Create user in database
const createUserInDatabase = async ({
  accountId,
  fullName,
  email,
}: {
  accountId: string;
  fullName: string;
  email: string;
}) => {
  console.log("👤 [createUserInDatabase] Creating user for:", email);
  
  try {
    const { tablesDB } = await createAdminClient();
    
    const userData = {
      fullName,
      email,
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZLHXQPfG_ZvsBVAbS65AtL3Cyj4QV198L9A&s",
      accountId,
    };
    
    const newRow = await tablesDB.createRow(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollection,
      ID.unique(),
      userData
    );
    
    console.log("✅ [createUserInDatabase] User created successfully!");
    return newRow;
  } catch (error) {
    console.error("💥 [createUserInDatabase] ERROR:", error);
    throw new Error(`Failed to create user in database: ${error?.message || 'Unknown error'}`);
  }
};

// ==================== PASSWORD SIGN UP ====================

/**
 * Sign up with Email + Password
 * - Creates Appwrite account with password
 * - Creates user in database
 * - Creates session automatically
 */
export const signUpWithPassword = async ({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) => {
  console.log("\n🚀 [signUpWithPassword] Starting password sign up for:", email);
  
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      throw new Error("User already exists. Please sign in instead.");
    }
    
    const { account } = await createAdminClient();
    
    // Create Appwrite account with password
    const userId = ID.unique();
    console.log("🆔 [signUpWithPassword] Generated userId:", userId);
    
    const newAccount = await account.create(
      userId,
      email,
      password,
      fullName
    );
    
    console.log("✅ [signUpWithPassword] Appwrite account created:", newAccount.$id);
    
    // Create user in database
    await createUserInDatabase({
      accountId: newAccount.$id,
      fullName,
      email,
    });
    
    // Create session automatically
    const session = await account.createEmailPasswordSession(email, password);
    
    // Set session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    
    console.log("✅ [signUpWithPassword] Sign up complete with session!");
    return parseStringify({ accountId: newAccount.$id });
    
  } catch (error: any) {
    console.error("💥 [signUpWithPassword] ERROR:", error);
    throw new Error(error?.message || "Failed to create account");
  }
};

// ==================== PASSWORD SIGN IN ====================

/**
 * Sign in with Email + Password
 * - Verifies credentials
 * - Creates session
 */
export const signInWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log("\n🚀 [signInWithPassword] Starting password sign in for:", email);
  
  try {
    const { account } = await createAdminClient();
    
    // Create email password session
    const session = await account.createEmailPasswordSession(email, password);
    
    // Set session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    
    console.log("✅ [signInWithPassword] Sign in successful!");
    return parseStringify({ sessionId: session.$id });
    
  } catch (error: any) {
    console.error("💥 [signInWithPassword] ERROR:", error);
    throw new Error("Invalid email or password");
  }
};


export const sendSignInOTP = async (email: string) => {
  console.log("\n🚀 [sendSignInOTP] Starting OTP sign in for:", email);
  
  try {
    // Check if user exists
    const existingUser = await getUserByEmail(email);
    
    if (!existingUser) {
      throw new Error("User not found. Please sign up first.");
    }
    
    // Send OTP using existing accountId
    const { account } = await createAdminClient();
    const token = await account.createEmailToken(existingUser.accountId, email);
    
    
    return parseStringify({ 
      accountId: token.userId,
      email,
    });
    
  } catch (error: any) {
    throw error;
  }
};

/**
 * Step 2: Verify OTP for Sign In
 * - Verifies the OTP code
 * - Creates session
 */
export const verifySignInOTP = async ({
  accountId,
  otp,
}: {
  accountId: string;
  otp: string;
}) => {
  
  try {
    const { account } = await createAdminClient();
    
    // Verify OTP and create session
    const session = await account.createSession(accountId, otp);
    
    // Set session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    
    return parseStringify({ sessionId: session.$id });
    
  } catch (error: any) {
    throw new Error(`Failed to verify OTP: ${error?.message || 'Invalid code'}`);
  }
};

// ==================== RESEND OTP ====================

/**
 * Resend OTP for sign in
 */
export const resendOTP = async ({
  email,
  accountId,
}: {
  email: string;
  accountId?: string;
}) => {
  
  try {
    const { account } = await createAdminClient();
    
    // If accountId provided, use it; otherwise look up user
    let finalAccountId = accountId;
    
    if (!finalAccountId) {
      const user = await getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      finalAccountId = user.accountId;
    }
    
    const token = await account.createEmailToken(finalAccountId, email);
    
    return parseStringify({ accountId: token.userId });
    
  } catch (error: any) {
    throw error;
  }
};

// ==================== GET CURRENT USER ====================

// ==================== GET CURRENT USER ====================

export const getCurrentUser = async () => {
  
  try {
    
    // Use createSessionClient to access the session cookie
    const { account } = await createSessionClient();
    
    const accountResult = await account.get();
 
    if (accountResult.$id) {
      
      // Now use admin client to query the database
      const { databases } = await createAdminClient();
      
      const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollection,
        [Query.equal("accountId", accountResult.$id)]
      );
      
      
      if (user.documents.length > 0) {
       
        return parseStringify(user.documents[0]);
      } else {
        
      }
    } else {
    }
    
    return null;
  } catch (error) {
   
    return null;
  }
};
// ==================== SIGN OUT ====================

export const signOut = async () => {
  try {
    const { account } = await createSessionClient()
 await account.deleteSessions();   
 (await cookies()).delete('appwrite-session');
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
export const getUserDetails = async () => {
  try {
    const { account } = await createSessionClient();
    const { tablesDB } = await createAdminClient();
    
    const accountResult = await account.get();
    console.log("📋 Account ID:", accountResult.$id);
    
    if (accountResult.$id) {
      // Try without any filter first to see if we can read the collection
      const allUsers = await tablesDB.listRows(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollection
      );
      
      console.log("📦 All users count:", allUsers.rows.length);
      
      // Find the user manually
      const dbUser = allUsers.rows.find(
        (row: any) => row.accountId === accountResult.$id
      );
      
      if (dbUser) {
        console.log("✅ Found user:", dbUser.email);
        return parseStringify({
          ...accountResult,
          accountId: dbUser.accountId,
          fullName: dbUser.fullName,
          avatar: dbUser.avatar,
        });
      } else {
        console.log("❌ No user found with accountId:", accountResult.$id);
      }
    }
    
    return null;
  } catch (error) {
    console.log("Error fetching user details:", error);
    throw error;
  }
};



