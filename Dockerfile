FROM node:4.4.7
RUN mkdir app/
RUN npm install -g bower 
RUN npm install -g gulp
ADD ./package.json app/
ADD ./bower.json app/
WORKDIR app/
RUN npm install 
ADD . .
RUN bower --config.interactive=false install --allow-root
