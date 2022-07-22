FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN npm i yarn
RUN yarn install --frozen-lockfile
COPY . .
CMD ["yarn", "dev"]