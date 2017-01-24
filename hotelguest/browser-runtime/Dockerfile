FROM nginx:stable

RUN apt-get update && apt-get install -y wget
#RUN git clone https://github.com/reTHINK-project/dev-runtime-browser.git /tmp/dev-runtime-browser

RUN wget https://github.com/reTHINK-project/dev-runtime-browser/archive/v0.4.0.tar.gz -O /tmp/runtime.tar.gz
RUN tar -xzf /tmp/runtime.tar.gz -C /tmp/


RUN mkdir -p /usr/share/nginx/html/.well-known/runtime
RUN cp -R /tmp/dev-runtime-browser-0.4.0/bin/* /usr/share/nginx/html/.well-known/runtime/