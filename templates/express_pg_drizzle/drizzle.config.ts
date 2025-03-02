import { defineConfig } from 'drizzle-kit';



export default defineConfig({
  
  schema: './src/drizzle/schema.ts',   
  out: './src/drizzle/migrations',      
  driver: 'pglite',
  dialect: 'postgresql',                
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
});
