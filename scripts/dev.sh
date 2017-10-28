cd client 
gnome-terminal -x sh -c "gulp & webpack"
cd server
gnome-terminal -x sh -c "nodemon -e njk,js,css server.js; exec sh;"
