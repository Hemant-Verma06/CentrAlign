# Cloudinary Setup Guide

Follow these steps to get your API keys and configure the Upload Preset.

## 1. Create an Account
1.  Go to [Cloudinary](https://cloudinary.com/users/register/free).
2.  Sign up for a free account.

## 2. Get API Keys
1.  Once logged in, go to the **Dashboard** (main page).
2.  You will see a section called **"Product Environment Credentials"**.
3.  Copy the following values:
    *   **Cloud Name** -> `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
    *   **API Key** -> `CLOUDINARY_API_KEY`
    *   **API Secret** -> `CLOUDINARY_API_SECRET`

## 3. Create an Upload Preset (Crucial!)
The upload widget needs an "Unsigned" upload preset to work from the browser.

1.  Go to **Settings** (Gear icon at bottom left) -> **Upload**.
2.  Scroll down to the **"Upload presets"** section.
3.  Click **Add Upload Preset**.
4.  **Name**: Set the name to `ai_form_generator_preset` (or whatever you prefer, but make sure it matches the code in `components/ImageUpload.tsx`).
5.  **Signing Mode**: Change this from "Signed" to **"Unsigned"**.
6.  Click **Save**.

## 4. Update Your Project
1.  Open `d:\VS_CODE_WORKSPACE\CentrAlign\ai_form_generator\.env.local`.
2.  Fill in the keys you copied in Step 2.

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
