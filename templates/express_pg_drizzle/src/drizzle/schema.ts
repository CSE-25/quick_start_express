import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const sampleTable = pgTable("SampleTable1", {
    column1: uuid("column1").primaryKey().defaultRandom(),
    column2: varchar("column2", {length: 255}).notNull()
})