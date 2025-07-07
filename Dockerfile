FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "run", "start"]