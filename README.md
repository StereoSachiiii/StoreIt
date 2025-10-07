# StoreIT - Cloud File Storage Platform

A modern, feature-rich cloud storage application built with Next.js 15, Appwrite, and TypeScript. Upload, organize, search, and share your files with an elegant and responsive interface.

DISCLAIMER
- The server components use Browser API's therefore when deploying you might have to refractor  some server side actions and make them client components such as Auth related actions.


## Features

- Secure Authentication - User authentication powered by Appwrite
- File Upload - Easy drag-and-drop file uploads
- Smart Organization - Automatic file categorization (Documents, Images, Media, Others)
- Real-time Search - Quick file search with substring matching
- Beautiful UI - Modern gradient design with smooth animations
- Responsive Design - Works seamlessly on desktop, tablet, and mobile
- File Sharing - Share files with other users
- Sort and Filter - Organize files by name, date, or size
- Storage Management - Track your storage usage
- Fast Performance - Built with Next.js 15 App Router

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Backend: Appwrite
- Styling: Tailwind CSS
- Authentication: Appwrite Auth
- Database: Appwrite Database
- Storage: Appwrite Storage

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- An Appwrite account and project

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/storeit.git
cd storeit
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=your_files_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
NEXT_APPWRITE_API_KEY=your_api_key
```

4. Configure Appwrite

Create the following in your Appwrite Console:

### Database Setup

Create a database and a files collection with these attributes:

- name (String, required)
- type (String, required) - Values: document, image, video, audio
- size (Integer, required)
- accountId (String, required)
- users (String[], required)
- bucketFileId (String, required)
- url (String, required)

### Storage Setup

- Create a storage bucket
- Configure file size limits and allowed file types

5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 to see the app.

## Project Structure

```
StoreIt/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── otp-sign-in/
│   │   ├── logout/
│   │   ├── FormContext.tsx
│   │   └── layout.tsx
│   ├── (root)/
│   │   ├── [type]/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── upload/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── context/
│   │   └── userContext.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── pagination.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sonner.tsx
│   │   └── spinner.tsx
│   ├── ActionDrop.tsx
│   ├── AuthForm.tsx
│   ├── Card.tsx
│   ├── FileUploader.tsx
│   ├── Header.tsx
│   ├── OTPModal.tsx
│   ├── Sidebar.tsx
│   ├── Sort.tsx
│   └── Welcome.tsx
├── lib/
│   ├── actions/
│   │   ├── file.actions.ts
│   │   ├── types.ts
│   │   └── user.actions.ts
│   ├── appwrite/
│   │   ├── config.ts
│   │   └── index.ts
│   └── utils.ts
├── public/
│   ├── back.svg
│   ├── cloud.svg
│   ├── Dashboard.png
│   ├── file.svg
│   ├── Folder.png
│   ├── globe.svg
│   ├── Image.png
│   ├── Logo.png
│   ├── Other.png
│   ├── person.png
│   ├── Video.png
│   └── window.svg
├── .env.local
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Usage

### Uploading Files

1. Click the Upload button in the header
2. Drag and drop files or click to browse
3. Files are automatically categorized by type

### Searching Files

1. Use the search bar in the header
2. Type your search query
3. Press Enter to search
4. Results update based on file names

### Organizing Files

1. Navigate using the sidebar
2. Filter by: Documents, Images, Media, or Others
3. Use the sort dropdown to organize by name, date, or size

### Sharing Files

1. Click on a file card
2. Select Share
3. Add user email addresses
4. Set permissions

## Security Features

- Secure authentication with Appwrite
- User-specific file access control
- Shared file permissions
- Server-side validation
- Protected API routes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- React 19
- Next.js - React framework
- Appwrite - Backend platform
- Tailwind CSS - Styling
- shadcn/ui - UI components

## Contact

Project Link: https://github.com/yourusername/storeit

Made with care by Your Name
