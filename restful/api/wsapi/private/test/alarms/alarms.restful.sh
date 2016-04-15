BASE_URL=`cat baseurl`
JSON="Content-Type:application/json"

echo
echo "##################################################################"
echo "#	begin test " ${0}
echo "##################################################################"
echo

ACCOUNT_ID=1
PROJECT_ID=1
STATION_ID=1
DEVICE_ID=1

USER_ID=1
ACK_MESSAGE="test for ack alarm"

TRIGGER_1_ID=1
ALARM_TOPIC_1="TAG_1_HH"

TRIGGER_2_ID=2
ALARM_TOPIC_2="TAG_1_LL"

TRIGGER_3_ID=3
ALARM_TOPIC_3="TAG_2_SP"

TRIGGER_4_ID=4
TRIGGER_5_ID=5

echo "----------------------------------------------"
echo "create space, account: ${ACCOUNT_1_ID}"
curl -X POST -H ${JSON} "${BASE_URL}/account/${ACCOUNT_ID}/create"
echo

echo "----------------------------------------------"
echo "create alarm, trigger: ${TRIGGER_1_ID}, alarm:${ALARM_TOPIC_1}"
ALARM_1_SOURCE={\"account_id\":${ACCOUNT_ID},\"device_id\":${DEVICE_ID}}
ALARM_1_FIELDS={\"class_id\":1,\"info\":\"test\",\"trigger_id\":${TRIGGER_1_ID}}
ALARM_1="{\"source\":${ALARM_1_SOURCE},\"fields\":${ALARM_1_FIELDS}}"
echo ${ALARM_1}
RET=`curl -X POST -H ${JSON} -d ${ALARM_1} "${BASE_URL}/account/${ACCOUNT_ID}/newalarm"`
echo ${RET}
ALARM_1_ID=`echo ${RET} | grep -Po '"ret":\d*' | sed 's/"ret"://'`
echo "alarm id:${ALARM_1_ID}"
echo

echo "----------------------------------------------"
echo "clear alarm, alarm:${ALARM_TOPIC_1}"
curl -X PUT -H ${JSON} "${BASE_URL}/account/${ACCOUNT_ID}/clearalarm?trigger_id=${TRIGGER_1_ID}&device_id=${DEVICE_ID}"
echo

echo "----------------------------------------------"
echo "close alarm, alarm:${ALARM_TOPIC_1}, alarm id:${ALARM_1_ID}"
curl -X PUT -H ${JSON} "${BASE_URL}/account/${ACCOUNT_ID}/closealarm?id=${ALARM_1_ID}"
echo

echo "----------------------------------------------"
echo "acknowledge alarm, alarm:${ALARM_TOPIC_1}, alarm id:${ALARM_1_ID}"
ACK_ALARM_1_OBJ="{\"user_id\":${USER_ID}, \"message\":\"${ACK_MESSAGE}\"}"
echo "ack information:"
echo ${ACK_ALARM_1_OBJ}
echo "return:"
curl -X PUT -H ${JSON} -d "${ACK_ALARM_1_OBJ}" "${BASE_URL}/account/${ACCOUNT_ID}/ackalarm?id=${ALARM_1_ID}"
echo

echo "----------------------------------------------"
echo "create alarm, trigger: ${TRIGGER_2_ID}, alarm:${ALARM_TOPIC_2}"
ALARM_2_SOURCE={\"account_id\":\"${ACCOUNT_ID}\",\"device_id\":\"${DEVICE_ID}\"}
ALARM_2_FIELDS={\"class_id\":1,\"info\":\"test\",\"trigger_id\":\"${TRIGGER_2_ID}\"}
ALARM_2="{\"source\":${ALARM_2_SOURCE},\"fields\":${ALARM_2_FIELDS}}"
echo ${ALARM_2}
RET=`curl -X POST -H ${JSON} -d ${ALARM_2} "${BASE_URL}/account/${ACCOUNT_ID}/newalarm"`
echo ${RET}
ALARM_2_ID=`echo ${RET} | grep -Po '"ret":\d*' | sed 's/"ret"://'`
echo "alarm id:${ALARM_2_ID}"
echo

echo "----------------------------------------------"
echo "clear alarm, alarm:${ALARM_TOPIC_2}"
curl -X PUT -H ${JSON} "${BASE_URL}/account/${ACCOUNT_ID}/clearalarm?trigger_id=${TRIGGER_2_ID}&device_id=${DEVICE_ID}"
echo

echo "----------------------------------------------"
echo "create alarm and we will never close it, trigger: ${TRIGGER_3_ID}, alarm:${ALARM_TOPIC_3}"
ALARM_3_SOURCE={\"account_id\":\"${ACCOUNT_ID}\",\"device_id\":\"${DEVICE_ID}\"}
ALARM_3_FIELDS={\"class_id\":1,\"info\":\"test\",\"trigger_id\":\"${TRIGGER_3_ID}\"}
ALARM_3="{\"source\":${ALARM_3_SOURCE},\"fields\":${ALARM_3_FIELDS}}"
echo ${ALARM_3}
RET=`curl -X POST -H ${JSON} -d ${ALARM_3} "${BASE_URL}/account/${ACCOUNT_ID}/newalarm"`
echo ${RET}
ALARM_3_ID=`echo ${RET} | grep -Po '"ret":\d*' | sed 's/"ret"://'`
echo "alarm id:${ALARM_3_ID}"
echo

echo "----------------------------------------------"
echo "create alarm of INVALID_ACCOUNT, trigger: ${TRIGGER_4_ID}"
ALARM_4_SOURCE={\"account_id\":null,\"device_id\":\"${DEVICE_ID}\"}
ALARM_4_FIELDS={\"class_id\":1,\"info\":\"test\",\"trigger_id\":\"${TRIGGER_4_ID}\"}
ALARM_4="{\"source\":${ALARM_4_SOURCE},\"fields\":${ALARM_4_FIELDS}}"
echo ${ALARM_4}
curl -X POST -H ${JSON} -d ${ALARM_4} "${BASE_URL}/account/${ACCOUNT_ID}/newalarm"
echo

echo "----------------------------------------------"
echo "clear NOT EXIST alarm"
curl -X PUT -H ${JSON} "${BASE_URL}/account/${ACCOUNT_ID}/clearalarm?trigger_id=null&device_id=${DEVICE_ID}"
echo
