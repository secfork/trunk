#!/bin/bash

echo
echo "##################################################################"
echo "#	begin test " ${0}
echo "##################################################################"
echo

TEST_PATH="alarms"
echo "Running all case in ${PWD}/${TEST_PATH}/"

cd ${TEST_PATH}
#for f in ${TEST_PATH}/*
for f in ./*
do
	if [ -x $f ]; then
		./$f
		sleep 1s
	fi
done
cd ..