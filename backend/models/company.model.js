import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDB({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create DynamoDB Document client to use higher-level operations
export const dynamoDB = DynamoDBDocument.from(client);

// Define the "Companies" table model
export const CompanyTable = {
  TableName: "Companies",
  KeySchema: [
    { AttributeName: "companyId", KeyType: "HASH" }, // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: "companyId", AttributeType: "S" }, // String
    { AttributeName: "userId", AttributeType: "S" },    // String
    { AttributeName: "CompanyName", AttributeType: "S" }, // String
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "UserIndex",
      KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }, // Partition key for UserIndex
      ],
      Projection: {
        ProjectionType: "ALL", // Include all attributes in the index
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
    {
      IndexName: "NameIndex",
      KeySchema: [
        { AttributeName: "CompanyName", KeyType: "HASH" }, // Partition key for NameIndex
      ],
      Projection: {
        ProjectionType: "ALL", // Include all attributes in the index
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
};

// Helper function to create the table if it doesn't exist
export const createCompanyTable = async () => {
  try {
    await client.createTable(CompanyTable);
    console.log("Companies table created successfully");
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log("Companies table already exists");
    } else {
      console.error("Error creating Companies table:", error);
      throw error;
    }
  }
};