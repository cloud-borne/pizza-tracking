import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const orderId = event.queryStringParameters?.order_id;
    const connectionId = event.requestContext.connectionId;

    await docClient.send(
      new PutCommand({
        TableName: process.env.TABLENAME,
        Item: {
          order_id: orderId,
          connection_id: connectionId
        }
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.error("Error storing connection:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};
