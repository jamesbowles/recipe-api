'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async (event, context) => {
  const recipe = JSON.parse(event.body)
  const timestamp = new Date().getTime();
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		Key: {
      id: event.pathParameters.id,
		},
    ExpressionAttributeNames: {
      '#recipe_name': 'name',
      '#recipe_method': 'method',
    },
    UpdateExpression: "SET #recipe_name=:name, description=:description, ingredients=:ingredients, #recipe_method=:method, update_at=:updated_at",
    ExpressionAttributeValues:{
      ':name': recipe.name,
      ':description': recipe.description || null,
      ':ingredients': recipe.ingredients,
      ':method': recipe.method,
      ':updated_at': timestamp
    },
    ReturnValues:"ALL_NEW"
	};

	try {
		const recipeData = await dynamoDb.get({
			TableName: process.env.DYNAMODB_TABLE,
			Key: {
				id: event.pathParameters.id
			}
		}).promise();

		if (recipeData.Item.user_id  !== event.requestContext.authorizer.principalId) {
			return {
				statusCode: 403,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: JSON.stringify({ error: 'nope' }),
			};
		}

		const data = await dynamoDb.update(params).promise();
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
			error: `could not update recipe: ${error.stack}`
		};
	}
};
