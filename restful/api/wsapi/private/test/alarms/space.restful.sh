BASE_URL=`cat baseurl`
JSON="Content-Type:application/json"

echo
echo "##################################################################"
echo "#	begin test " ${0}
echo "##################################################################"
echo

ACCOUNT_1_ID=1
ACCOUNT_2_ID=2

echo "----------------------------------------------"
echo "create space, account: ${ACCOUNT_1_ID}"
curl -X POST -H ${JSON} "${BASE_URL}/account/${ACCOUNT_1_ID}/create"
echo

echo "----------------------------------------------"
echo "create space, account: ${ACCOUNT_2_ID}"
curl -X POST -H ${JSON} "${BASE_URL}/account/${ACCOUNT_2_ID}/create"
echo

echo "----------------------------------------------"
echo "get space, account: ${ACCOUNT_1_ID}"
curl "${BASE_URL}/account/${ACCOUNT_1_ID}/get"
echo

echo "----------------------------------------------"
echo "get space, account: ${ACCOUNT_2_ID}"
curl "${BASE_URL}/account/${ACCOUNT_2_ID}/get"
echo

echo "----------------------------------------------"
echo "set space, account: ${ACCOUNT_1_ID}"
curl -X PUT -H ${JSON} -d "{\"max_save_period\":2}" "${BASE_URL}/account/${ACCOUNT_1_ID}/set"
echo

echo "----------------------------------------------"
echo "get space, account: ${ACCOUNT_1_ID}"
curl "${BASE_URL}/account/${ACCOUNT_1_ID}/get"
echo

echo "----------------------------------------------"
echo "drop space, account: ${ACCOUNT_1_ID}"
curl -X DELETE "${BASE_URL}/account/${ACCOUNT_1_ID}/drop"
echo

echo "----------------------------------------------"
echo "drop space, account: ${ACCOUNT_2_ID}"
curl -X DELETE "${BASE_URL}/account/${ACCOUNT_2_ID}/drop"
echo

CLASS_1_ID=1
CLASS_1_NAME="class_1"
CLASS_2_ID=2
CLASS_2_NAME="class_2"

echo "----------------------------------------------"
echo "set class, accout:${ACCOUNT_1_ID}, class:${CLASS_1_ID}"
curl -X PUT -H ${JSON} -d "{\"name\":\"${CLASS_1_NAME}\"}" "${BASE_URL}/account/${ACCOUNT_1_ID}/setclass?class_id=${CLASS_1_ID}"
echo

echo "----------------------------------------------"
echo "set class, accout:${ACCOUNT_1_ID}, class:${CLASS_2_ID}"
curl -X PUT -H ${JSON} -d "{\"name\":\"${CLASS_2_NAME}\"}" "${BASE_URL}/account/${ACCOUNT_1_ID}/setclass?class_id=${CLASS_2_ID}"
echo

echo "----------------------------------------------"
echo "get classes of account:${ACCOUNT_1_ID}"
curl "${BASE_URL}/account/${ACCOUNT_1_ID}/getclasses"
echo

echo "----------------------------------------------"
echo "get classes of account:${ACCOUNT_1_ID}, name=${CLASS_1_NAME} && name=${CLASS_2_NAME} "
curl "${BASE_URL}/account/${ACCOUNT_1_ID}/getclasses?name=${CLASS_1_NAME}&name=${CLASS_2_NAME}"
echo

echo "----------------------------------------------"
echo "get severities(all) "
curl "${BASE_URL}/getseverity"
echo

echo "----------------------------------------------"
echo "get severities(all), level=1 || level=2 "
curl "${BASE_URL}/getseverity?id=1&id=2"
echo