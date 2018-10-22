'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

module.exports.get = async (event, context) => {
	const dynamoDb = new AWS.DynamoDB.DocumentClient();
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Key: {
			id: event.pathParameters.id,
		}
	};

	try {
		const data = await dynamoDb.get(params).promise();
		return {
			statusCode: 200,
			headers: {
			 'Access-Control-Allow-Origin': '*',
			 'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
    console.log(error)
		return {
			statusCode: 400,
			error: `could not fetch recipe: ${error.stack}`
		};
	}


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
