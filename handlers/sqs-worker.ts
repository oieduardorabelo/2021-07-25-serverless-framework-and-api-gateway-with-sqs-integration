import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const { FORM_POST_TABLE_NAME = "" } = process.env;

const ddb = new DynamoDB.DocumentClient();

interface IPutRequest {
  PutRequest: {
    Item: {
      requestId: string;
      name: string;
      email: string;
      message: string;
    }
  }
}

interface IParamsBatchWrite {
  RequestItems: {
    [key: string]: IPutRequest[]
  }
}

async function main(event: SQSEvent) {
  console.log("[SLS] Input Event", JSON.stringify(event));
  const paramsBatchWrite: IParamsBatchWrite = {
    RequestItems: {
      [FORM_POST_TABLE_NAME]: []
    }
  };
  event.Records.forEach(record => {
    const requestId = record.messageAttributes.requestId.stringValue;
    const payload = JSON.parse(record.body);
    paramsBatchWrite.RequestItems[FORM_POST_TABLE_NAME].push({
      PutRequest: {
        Item: {
          requestId,
          ...payload
        }
      }
    })
  });
  console.log("[SLS] Params Batch Write", JSON.stringify(paramsBatchWrite));
  await ddb.batchWrite(paramsBatchWrite).promise();
}

const handler = main;

export { handler }
    