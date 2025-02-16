import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.joseph.aora',
    projectId: '67b0a989002fa706df4b',
    databaseId: '67b0be030012db58e48b',
    userCollectionId: '67b0be1300283c420acd',
    videoCollectionId: '67b0be29000d90b98ea7',
    storageId: '67b0bf0e0017c6df4a23',
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
    ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) throw Error;
        const avataUrl = avatars.getInitials(username)
        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avataUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}