FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
# We skip package-lock for now as we don't have one generated yet, so just npm install
RUN npm install

COPY . .

# In a real environment, you'd run `npm run build` 
# RUN npm run build

# For development purposes, let's just use the dev server in the Docker image
# or serve the static files. Given this is a full stack docker-compose setup, 
# we'll run `npm run dev` to support hot reloading when volume mounted.

EXPOSE 80

# This command runs vite dev server on port 80
CMD ["npm", "run", "dev", "--", "--port", "80", "--host", "0.0.0.0"]
