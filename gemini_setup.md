# Google Gemini API Setup Guide

Follow these steps to get your Gemini API key.

## 1. Go to Google AI Studio
1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Sign in with your Google account.

## 2. Create an API Key
1.  You will see a page titled **"Get an API key"**.
2.  Click **"Create API key"**.
3.  You may be prompted to select a Google Cloud project:
    *   If you have an existing project, select it.
    *   If not, click **"Create API key in new project"**.
4.  Your API key will be generated and displayed.
5.  **Copy the API key immediately** (it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`).

## 3. Important Notes
*   **Free Tier**: Gemini API has a generous free tier with rate limits.
*   **Keep it Secret**: Never commit your API key to GitHub or share it publicly.

## 4. Update Your Project
1.  Open `d:\VS_CODE_WORKSPACE\CentrAlign\ai_form_generator\.env.local`.
2.  Paste your API key:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 5. Test It
Once you've added all the keys to `.env.local`, run:
```bash
npm run dev
```

Your app should now be fully functional! 🚀
