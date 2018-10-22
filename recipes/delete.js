'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = async (event, context) => {
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Key: {
      id: event.pathParameters.id,
		}
	};

	try {
    const recipeData = await dynamoDb.get(params).promise();
    if (recipeData.Item.user_id !== event.requestContext.authorizer.principalId) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ error: 'nope' }),
      };
    }

		await dynamoDb.delete(params).promise();
		return {
			statusCode: 200,
			headers: {
			 'Access-Control-Allow-Origin': '*',
			 'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({}),
		};
	} catch (error) {
    console.log("-+-+-+-+-+-+-+-+-+-")
    console.log(error)
    console.log("-+-+-+-+-+-+-+-+-+-")
		return {
			statusCode: 400,
			error: `could not delete recipe: ${error.stack}`
		};
	}

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
