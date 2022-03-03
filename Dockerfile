FROM node:10

# RUN apk update \
#     apk add openssl/libcrypto1.1.1l-r0

# RUN apk upgrade --no-cache -U && \
#     apk add --no-cache openssl/libcrypto1.1.1l-r0

WORKDIR /home/fiber

COPY package*.json ./

RUN npm install

COPY . .

# set environment variable in image
#ENV NODE_ENV=uat03

# start app
CMD ["npm", "start"]


