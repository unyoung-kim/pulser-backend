"use strict";
// Express server, entry point.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const test_handler_1 = require("./handler/test-handler");
const trpc_1 = require("./lib/trpc");
// Initialize Express app
const app = (0, express_1.default)();
// Express middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json()); // This should parse JSON request bodies
/**
 * tRPC routers from here
 * You should add any additional handlers in the '/handler' folder!!
 *
 * query => GET methods
 * mutation => POST methods
 */
const trpcRouter = trpc_1.t.router({
    hello: (0, test_handler_1.testEndpointHandler)(trpc_1.t, "hello"),
    // Just keep adding More endpoints here...
});
// TODO: I should probably add auth here too but I can do this later.
// Apply the tRPC middleware on the '/trpc' route
app.use("/trpc", trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: () => ({}),
}));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`👨‍💻 Server running on http://localhost:${PORT}`);
});
