# build the site using node container
FROM node:8
WORKDIR /build
# RUN npm install -g yarn
COPY package.json yarn.lock ./
COPY packages/phxtech-db/package.json ./packages/phxtech-db/package.json
COPY packages/phxtech-debug/package.json ./packages/phxtech-debug/package.json
COPY packages/scraper/package.json ./packages/scraper/package.json
COPY packages/www/package.json ./packages/www/package.json
RUN yarn install --prod --pure-lockfile

# distribute much smaller alpine image
FROM node:8-alpine
WORKDIR /app
COPY --from=0 /build ./
COPY . .

CMD [ "node", "packages/www/index.js" ]
