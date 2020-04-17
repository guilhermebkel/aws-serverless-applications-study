QUEUE_NAME=$1

aws --endpoint-url=http://localhost:4576 sqs create-queue --queue-name $QUEUE_NAME 

aws --endpoint-url=http://localhost:4576 sqs list-queues
