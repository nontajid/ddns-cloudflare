FROM node:8.15.0                                                                
                                                                                
WORKDIR /ddns-cloudflare                                                        
                                                                                
RUN apt-get update && apt-get install -y                                        
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
