-- CreateTable
CREATE TABLE "Drivers" (
    "id_driver" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "note" TEXT
);

-- CreateTable
CREATE TABLE "Passenger" (
    "id_passenger" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "plate" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "Schedule" (
    "schedule_id" TEXT NOT NULL PRIMARY KEY,
    "leave" DATETIME NOT NULL,
    "arrive" DATETIME,
    "driver_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "scheduler_id" TEXT NOT NULL,
    CONSTRAINT "Schedule_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Drivers" ("id_driver") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("plate") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_scheduler_id_fkey" FOREIGN KEY ("scheduler_id") REFERENCES "User" ("id_user") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "height" INTEGER NOT NULL DEFAULT 0,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL
);
