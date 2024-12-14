FROM node:16

EXPOSE 3001
WORKDIR /usr/src/app

COPY package* .
RUN npm install --omit=dev

COPY . .

# env vars to be set during deployment.
#ENV PORT=3001 MONGODB_URI=""

CMD ["node", "index.js"]



