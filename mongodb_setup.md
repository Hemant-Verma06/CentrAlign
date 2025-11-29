# MongoDB Atlas Setup Guide

Follow these steps to create a free MongoDB database and get your connection string.

## 1. Create an Account
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up for a free account (you can use Google Sign-in).

## 2. Create a Cluster
1.  Once logged in, click **+ Create** to build a database.
2.  Select the **M0 (Free)** tier.
3.  Choose a provider (AWS is fine) and a region close to you (e.g., `us-east-1`).
4.  Click **Create Deployment**.

## 3. Create a Database User
1.  You will be prompted to set up security.
2.  **Username**: `admin` (or whatever you prefer).
3.  **Password**: Generate a secure password and **COPY IT** immediately. You will need this for your `.env.local`.
4.  Click **Create Database User**.

## 4. Allow Access (IP Whitelist)
1.  Scroll down to "Network Access" or "Where would you like to connect from?".
2.  Click **Add My Current IP Address** (for local development).
3.  **IMPORTANT**: To allow Vercel to connect later, you should also add `0.0.0.0/0` (Allow Access from Anywhere).
    *   Click **Add IP Address**.
    *   Enter `0.0.0.0/0` in the IP Address field.
    *   Description: "Allow All (Vercel)".
    *   Click **Confirm**.

## 5. Get Connection String
1.  Go back to the **Database** overview tab.
2.  Click the **Connect** button on your cluster.
3.  Select **Drivers**.
4.  You will see a connection string like:
    ```
    mongodb+srv://admin:<password>@cluster0.p8xyz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```
5.  Copy this string.

## 6. Update Your Project
1.  Open `d:\VS_CODE_WORKSPACE\CentrAlign\ai_form_generator\.env.local`.
2.  Paste the string into `MONGODB_URI`.
3.  **Replace `<password>`** with the actual password you created in Step 3.

Example in `.env.local`:
```env
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@cluster0.p8xyz.mongodb.net/ai_form_generator?retryWrites=true&w=majority
```
*(Note: I added `/ai_form_generator` after `.net` to specify the database name)*
