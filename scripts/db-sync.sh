HOST=35.189.134.4
DIR=/tmp/dump
rm -rf $DIR
mongodump -d krust -o $DIR
ssh $HOST "rm -rf $DIR"
rsync -rv $DIR/** "$HOST:$DIR"
ssh $HOST "mongorestore --drop $DIR"
