QUEUE_URL=$1

echo "Sending message..." $QUEUE_URL

aws --endpoint-url=http://localhost:4576 sqs send-message --queue-url $QUEUE_URL --message-body "Hello World"

aws --endpoint-url=http://localhost:4576 sqs receive-message --queue-url $QUEUE_URL
