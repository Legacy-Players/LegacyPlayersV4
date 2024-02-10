FROM nginx:1.23

RUN apt update \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt install -y nodejs \
    && apt install -y unzip \
    && mkdir /Webclient \
    && mkdir -p /var/www

COPY ./src /Webclient/src
COPY ./tools /Webclient/tools
COPY ./.browserslistrc /Webclient/.browserslistrc
COPY ./.editorconfig /Webclient/.editorconfig
COPY ./angular.json /Webclient/angular.json
COPY ./proxy.conf.json /Webclient/proxy.conf.json
COPY ./configuration.sh /Webclient/configuration.sh
COPY ./package.json /Webclient/package.json
COPY ./package-lock.json /Webclient/package-lock.json
COPY ./tsconfig.json /Webclient/tsconfig.json
COPY ./tsconfig.app.json /Webclient/tsconfig.app.json
COPY ./tsconfig.spec.json /Webclient/tsconfig.spec.json
COPY ./tsconfig.worker.json /Webclient/tsconfig.worker.json
COPY ./tslint.json /Webclient/tslint.json
COPY ./Addons /Webclient/Addons
COPY ./*.zip /Webclient/


WORKDIR /Webclient
RUN npm ci && echo N | npm run ng analytics off

ARG build_type
RUN <<EOF bash
    if [[ "$build_type" == "development" ]]; then
        npm run builddev
    else
        npm run build
    fi
EOF

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN cp -r dist/Webclient/* /var/www/
