import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({})
);

const apiGwClient = new ApiGatewayManagementApiClient({
  endpoint: process.env.APIGW_ENDPOINT
});

export const handler = async (event) => {
  try {
    const orderId = event.detail.item.order_id;

    const response = await ddbClient.send(
      new GetCommand({
        TableName: process.env.TABLENAME,
        Key: {
          order_id: orderId
        }
      })
    );

    const connectionId = response.Item.connection_id;

    await apiGwClient.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: Buffer.from(JSON.stringify(event.detail))
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Message sent"
      })
    };
  } catch (error) {
    console.error("Error sending websocket message:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};
