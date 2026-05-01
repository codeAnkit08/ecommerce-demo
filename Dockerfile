FROM node:20

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy remaining files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]