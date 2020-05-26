APP_NAME="stackoverflow-surveys-processing"
CLUSTER_NAME="data-processing"
PROJECT_NAME="process-data"
REGION="us-east-1"
LOG_GROUP_NAME="/ecs/$PROJECT_NAME"

ECS_ROLE_NAME="ecsTaskExecutionRole"
ECS_ROLE_ARN="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

CUSTOM_POLICY_NAME="$APP_NAME"-policy
CUSTOM_POLICY_ARN="arn:aws:iam::472767929985:policy/stackoverflow-surveys-processing-policy"

ECR_URI_DOCKER="472767929985.dkr.ecr.us-east-1.amazonaws.com/stackoverflow-surveys-processing"

SSM_ENV_PATH="/prod/$PROJECT_NAME/"

TASK_DEFINITION_ARN="arn:aws:ecs:us-east-1:472767929985:task-definition/process-data:1"

VPC_ID="vpc-677a041d"

SECURITY_GROUP_NAME="$PROJECT_NAME"

GROUP_ID="sg-0b96ac7211d827c74"

aws iam create-role \
	--region $REGION \
	--role-name $ECS_ROLE_NAME \
	--assume-role-policy-document file://templates/task-execution-assume-role.json \
	| tee logs/1.iam-create-role.txt

aws iam attach-role-policy \
	--region $REGION \
	--role-name $ECS_ROLE_NAME \
	--policy-arn $ECS_ROLE_ARN

aws iam create-policy \
	--region $REGION \
	--policy-name $CUSTOM_POLICY_NAME \
	--policy-document file://templates/custom-access-policy.json \
	| tee logs/2.iam-create-policy.txt

aws iam attach-role-policy \
	--region $REGION \
	--role-name $ECS_ROLE_NAME \
	--policy-arn $CUSTOM_POLICY_ARN

aws ecs create-cluster \
	--region $REGION \
	--cluster-name $CLUSTER_NAME \
	| tee logs/3.create-cluster.txt

aws logs create-log-group \
	--region $REGION \
	--log-group-name $LOG_GROUP_NAME \
	| tee logs/4.logs-create-log-group.txt

aws ecr create-repository \
	--region $REGION \
	--repository-name $APP_NAME \
	--image-scanning-configuration scanOnPush=true \
	| tee logs/5.create-docker-repo.txt

aws ecs register-task-definition \
	--region $REGION \
	--cli-input-json file://templates/task-definition.json \
	| tee logs/6.register-task.txt

aws ecs list-task-definitions \
	--region $REGION \
	| tee logs/7.task-definitions.txt

aws ec2 describe-vpcs \
	--region $REGION \
	| tee logs/8.describe-vpcs.txt

aws ec2 describe-subnets \
	--region $REGION \
	--filters="Name=vpc-id,Values=$VPC_ID" \
	--query "Subnets[*].SubnetId" \
	| tee logs/9.describe-subnets.txt

aws ec2 create-security-group \
	--region $REGION \
	--group-name $SECURITY_GROUP_NAME \
	--description "acess group for ecs tasks" \
	| tee logs/10.create-security-group.txt

aws ec2 authorize-security-group-ingress \
	--region $REGION \
	--group-id $GROUP_ID \
	--protocol tcp \
	--port 80 \
	--cidr 0.0.0.0/0 \
	| tee logs/11.authorize-sec-group.txt

aws iam detach-role-policy \
	--region $REGION \
	--role-name $ECS_ROLE_NAME \
	--policy-arn $CUSTOM_POLICY_ARN

aws iam \
	--region $REGION \
	delete-policy \
	--policy-arn $CUSTOM_POLICY_ARN