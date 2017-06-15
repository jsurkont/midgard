FROM arm32v7/ubuntu:16.04

MAINTAINER Jaroslaw Surkont <jarek.surkont@gmail.com>

RUN apt-get update \
  && apt-get -y dist-upgrade \
  && apt-get install -y --no-install-suggests --allow-unauthenticated curl \
  && rm -rf /var/lib/apt/lists/*

ENV BASE=/midgard \
  NVM_DIR=/root/.nvm \
  NODE_ENV=production \
  PORT=8082

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash \
  && . ${NVM_DIR}/nvm.sh \
  && nvm install --lts \
  && ln -s `which node` /usr/bin \
  && ln -s `which npm` /usr/bin

COPY . ${BASE}/
WORKDIR ${BASE}
RUN npm install --production

EXPOSE ${PORT}

ENTRYPOINT ["node", "./bin/www"]
