HOST=http://localhost:3000
APIKEY="d41d8cd98f00b204e9800998ecf8427e"

curl --silent \
	-H "x-api-key: $APIKEY" \
	$HOST/dev/hello

curl --silent \
	$HOST/dev/getUsagePlans | tee getUsagePlans.log

USAGE_PLAN_ID="hb238x"
KEYID="anxl6fl2m8"
APIKEY="sakcmqwe9o3464vcak123335555kvvmcnck"
FROM="2020-04-23"
TO="2020-04-24"

curl --silent \
	"$HOST/dev/getUsage?keyId=$KEYID&usagePlanId=$USAGE_PLAN_ID&from=$FROM&to=$TO" \
	| tee usage.log

CUSTOMER_NAME=test@test.com

curl --silent \
	"$HOST/dev/addKey?name=$CUSTOMER_NAME&usagePlanId=$USAGE_PLAN_ID" \
	| tee usage.log

KEYID="anxl6fl2m8"
APIKEY="asdjkJKH12395sjaMNASDj1c"