#!/bin/bash

if (ps aux | grep app.js | grep -v grep > /dev/null )
	then
      		echo app.js is already running, skipping execution >> /home/ec2-user/src/bytecell-app/log
  	else
		cd /home/ec2-user/src/bytecell-app
		~/.nvm/versions/node/v17.6.0/bin/node app.js >> /home/ec2-user/src/bytecell-app/log
 fi
