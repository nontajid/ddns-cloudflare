FROM node:16-slim

WORKDIR /ddns-cloudflare

RUN apt-get update && apt-get install -y
RUN apt-get install -y dnsutils
RUN npm install pm2 -g

# Install Package
ADD package.json /ddns-cloudflare
RUN npm install

# Add Application
ADD . /ddns-cloudflare

# Start Script
RUN cp docker-entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
