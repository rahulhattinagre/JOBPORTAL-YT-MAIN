# Setup Instructions

## Backend Email (Optional)
1. cd backend
2. npm install nodemailer
3. Add to .env:
```
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your-google-app-password
```
(Generate: https://myaccount.google.com/apppasswords)

4. Uncomment nodemailer code in user.controller.js register fn.

## Servers
- Backend: cd backend && npm run dev (localhost:8000)
- Frontend: cd frontend && npm run dev (localhost:5173)
