import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({});

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export const handler = async (event) => {
  try {
    const detail = event.detail;

    await delay(3000);
    detail.item.eventtype = "deliver_pizza";

    const response = await client.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "cook_pizza",
            DetailType: "eventtype",
            Detail: JSON.stringify(detail),
            EventBusName: process.env.EVENT_BUS
          }
        ]
      })
    );

    console.log("PutEvents response:", JSON.stringify(response));

    return response;
  } catch (error) {
    console.error("Error publishing event:", error);
    throw error;
  }
};
