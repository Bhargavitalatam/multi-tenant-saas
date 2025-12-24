FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y curl
COPY . .
EXPOSE 5000
CMD ["npm", "start"]