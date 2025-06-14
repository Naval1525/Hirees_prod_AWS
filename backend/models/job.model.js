export const JobTable = {
  TableName: "Jobs",
  KeySchema: [{ AttributeName: "jobId", KeyType: "HASH" }], // Primary Key

  AttributeDefinitions: [
    { AttributeName: "jobId", AttributeType: "S" },
    { AttributeName: "created_by", AttributeType: "S" },
    { AttributeName: "companyId", AttributeType: "S" },
  ],

  GlobalSecondaryIndexes: [
    {
      IndexName: "CreatedByIndex",
      KeySchema: [{ AttributeName: "created_by", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    },
    {
      IndexName: "CompanyIndex",
      KeySchema: [{ AttributeName: "companyId", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    },
  ],

  ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
};
