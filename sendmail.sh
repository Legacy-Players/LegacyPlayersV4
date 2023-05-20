SERVER="mail.turtle-archives.online:587"
FROM="legacy@turtle-archives.online"
TO="peersmurf@gmail.com"
SUBJ="Some subject"
MESSAGE="Some message"
CHARSET="utf-8"

sendemail -f $FROM -t $TO -u $SUBJ -s $SERVER -m $MESSAGE -v -o message-charset=$CHARSET
