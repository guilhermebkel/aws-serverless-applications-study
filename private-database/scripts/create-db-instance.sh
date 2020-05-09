CLUSTER_NAME=serverless-db
USERNAME=mota
PASSWORD=123
DB_NAME=heroes
SECRET_NAME=aurora-secret01
REGION=us-east-1

RESOURCE_ARN=arn:aws:rds:us-east-1:1237589473:cluster:serverless-db
SECRET_ARN=arn:aws:secretsmanager:us-east-1:1237589473:secret:serverless-db

aws rds create-db-cluster \
	--engine-version 5.6.10a \
	--db-cluster-identifier $CLUSTER_NAME \
	--engine-mode serverless \
	--engine aurora \
	--master-username $USERNAME \
	--master-user-password $PASSWORD \
	--scaling-configuration MinCapacity=2,MaxCapacity=4,AutoPause=false,TimeoutAction=ForceApplyCapacityChange \
	--enable-http-endpoint \
	--region $REGION \
	| tee rds-cluster.txt

CREATING="creating"
STATUS=$CREATING

while [ $STATUS == $CREATING ]
do
	STATUS=$(aws rds describe-db-clusters \
		--db-cluster-identifier $CLUSTER_NAME \
		--query 'DBClusters[0].Status' \
		| tee rds-status.txt)

	echo $STATUS

	sleep 1
done

aws secretsmanager create-secret \
	--name $SECRET_NAME \
	--description "Credentials for aurora serverless database" \
	--secret-string	'{"username": "'$USERNAME'", "password": "'$PASSWORD'"}' \
	--region $REGION \
	| tee secret.txt

aws rds-data execute-statement \
	--resource-arn $RESOURCE_ARN \
	--secret-arn $SECRET_ARN \
	--database mysql \
	--sql "show databases;" \
	--region $REGION \
	| tee cmd-show-dbs.txt

aws rds-data execute-statement \
	--resource-arn $RESOURCE_ARN \
	--secret-arn $SECRET_ARN \
	--database mysql \
	--sql "CREATE DATABASE $DB_NAME;" \
	--region $REGION \
	| tee cmd-create-db.txt

aws rds describe-db-subnet-groups \
	| tee db-subnets.txt

aws secretsmanager delete-secret \
	--secret-id $SECRET_NAME \
	| tee secret-delete.txt

aws rds delete-db-cluster \
	--db-cluster-identifier $CLUSTER_NAME \
	--skip-final-snapshot \
	| tee rds-delete.cluster.txt