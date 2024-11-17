/**@type { import("drizzle-kit").Config } */

export default {
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-interview-mocker_owner:9KF6tIAWGTcM@ep-rough-pond-a5qns1sq.us-east-2.aws.neon.tech/ai-interview?sslmode=require',
  }
};