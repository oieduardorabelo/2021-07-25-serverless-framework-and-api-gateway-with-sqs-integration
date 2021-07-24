import { APIGatewayProxyEvent } from "aws-lambda";

async function main(_event: APIGatewayProxyEvent) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
      },
      null,
      2
    ),
  };
}

const handler = main;

export { handler }
    