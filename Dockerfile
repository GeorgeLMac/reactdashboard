FROM  node:16.15.1-alpine3.16 AS builder

WORKDIR /app
COPY . .

RUN yarn --version
RUN apk add --no-cache git 

RUN yarn 
RUN yarn build

FROM  node:16.15.1-alpine3.16

RUN yarn global add serve
WORKDIR /app

COPY --from=builder /app/build .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY ./environment.sh .
RUN chmod +x /app/environment.sh 
CMD ["sh","-c","/app/environment.sh && serve -p 80 -s ."]

