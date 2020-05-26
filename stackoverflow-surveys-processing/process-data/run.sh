SSM_PREFIX="/prod/process-data/"

IMAGE_URL=$(aws ssm get-parameter \
	--region us-east-1 \
	--name "$SSM_PREFIX/ECS_PROCESS_DATA_IMAGE_URL" \
	--query "Parameter.Value" | jq -r)

IMAGE_URL=$(aws ssm get-parameter \
	--region us-east-1 \
	--name "$SSM_PREFIX/REGION" \
	--query "Parameter.Value" | jq -r)

docker build -t $IMAGE_URL .

docker run \
	-v ~/.aws/:/root/.aws \
	-e SURVEY_FILE='{"Bucket":"gbkel-serverless-01","Key":"survey_results_public.csv"}' \
	-e AWS_ENV_PATH="$SSM_PREFIX" \
	-e AWS_REGION="$REGION" \
	-t $IMAGE_URL

aws ecr get-login --no-include-email --region $REGION | bash

docker push $IMAGE_URL