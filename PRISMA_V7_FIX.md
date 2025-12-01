# Prisma v7 MongoDB Adapter Fix

## Issue
Prisma v7 requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor when using MongoDB.

## Solution Options

### Option 1: Use Prisma Accelerate (Recommended for production)
```typescript
return new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
})
```

### Option 2: Use MongoDB Adapter
```typescript
import { MongoClient } from 'mongodb'

const mongoClient = new MongoClient(process.env.DATABASE_URL)
return new PrismaClient({
  adapter: mongoClient,
})
```

### Option 3: Downgrade to Prisma v6
If you don't need Prisma v7 features, downgrade to v6 which doesn't require adapters:
```bash
npm install prisma@6 @prisma/client@6
```

## Current Implementation
We're using Option 2 with MongoClient adapter.

