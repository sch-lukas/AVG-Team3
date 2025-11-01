import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createInventoryClient } from "./inventoryClient";
import { charge } from "./paymentClient";
import { publishOrderToWarehouse } from "./warehousePublisher";
import { logger } from "./logger";
import { Order } from "./types";


