'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

module.exports.list = async () => {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
	};

	try {
		const data = await dynamoDb.scan(params).promise();
		return {
			statusCode: 200,
			headers: {
			 'Access-Control-Allow-Origin': '*',
			 'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
		return {
			statusCode: 400,
			error: `could not fetch recipes: ${error.stack}`
		};
	}

};
