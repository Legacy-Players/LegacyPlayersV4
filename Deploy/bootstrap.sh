HOST_USER='root'
HOST_IP='5.161.218.52'

unzip ./Keys.zip

scp -r ./Keys ${HOST_USER}@${HOST_IP}:/${HOST_USER}/
scp -r ./init.sh ${HOST_USER}@${HOST_IP}:/${HOST_USER}/

ssh ${HOST_USER}@${HOST_IP} "bash init.sh && rm init.sh && rm ~/Keys/ovh.ini"
