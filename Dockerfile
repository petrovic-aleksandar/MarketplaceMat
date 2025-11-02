FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --configuration=production

FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/Marketplace-Mat/browser /usr/share/nginx/html
EXPOSE 4200

#Build and run commands
#docker build -t marketplace-mat .
#docker run -d -p 4200:80 marketplace-mat