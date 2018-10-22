'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context) => {
  const recipe = JSON.parse(event.body)
  const timestamp = new Date().getTime();
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Item: {
      id: uuid.v1(),
      name: recipe.name,
      description: recipe.description || null,
      ingredients: recipe.ingredients,
      method: recipe.method,
      created_at: timestamp,
      updated_at: timestamp,
      user_id: event.requestContext.authorizer.principalId
    }
	};

	try {
		const data = await dynamoDb.put(params).promise();
		return {
			statusCode: 200,
			headers: {
			 'Access-Control-Allow-Origin': '*',
			 'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
    console.log("-+-+-+-+-+-+-+-+-+-")
    console.log(error)
    console.log("-+-+-+-+-+-+-+-+-+-")
		return {
			statusCode: 400,
			error: `could not post recipe: ${error.stack}`
		};
	}

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
