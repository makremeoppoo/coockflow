import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
    geminiModel: process.env.EXPO_PUBLIC_GEMINI_MODEL ?? 'gemini-3-flash-preview',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    backendUrl:  process.env.backendUrl ?? 'http://localhost:8000',

    platform: "com.app.cookflow",
    databaseId: '69772d86000411b6c2f0',
    bucketId: '697732a70005b1b88d90',
    userCollectionId: '697733a4001a2590f7cd',
    categoriesCollectionId: '697733b80038adc2c01d',
    menuCollectionId: '697733d100303d2774bd',
    customizationsCollectionId: '697733eb0018356e4734',
    menuCustomizationsCollectionId: '697734010032b62ddacc'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
         // 1. Logout any existing session first
        try {
            await account.deleteSessions();
            console.log('Cleared existing sessions');
        } catch (error) {
            console.log(error,'No sessions to clear');
        };
    
    // 2. Create the account
        const newUser = await account.create(
            ID.unique(),
            email,
            password,
            name
        );
            
        await account.createEmailPasswordSession(email, password);
        
        const avatarUrl = avatars.getInitialsURL(name);
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newUser.$id, avatar: avatarUrl }
        );
    } catch (e) {
        console.log("newAccount error",e)
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
            // 1. Logout any existing session first
        try {
            await account.deleteSessions();
            console.log('Cleared existing sessions');
        } catch (error) {
            console.log(error,'No sessions to clear');
        };
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}
