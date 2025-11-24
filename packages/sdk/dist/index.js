"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YokaiSDK = exports.SwapHelper = exports.JupiterClient = void 0;
const client_1 = require("@yokairpc/client");
const jupiter_1 = require("./jupiter");
const swap_1 = require("./swap");
__exportStar(require("./types"), exports);
__exportStar(require("./tokens"), exports);
var jupiter_2 = require("./jupiter");
Object.defineProperty(exports, "JupiterClient", { enumerable: true, get: function () { return jupiter_2.JupiterClient; } });
var swap_2 = require("./swap");
Object.defineProperty(exports, "SwapHelper", { enumerable: true, get: function () { return swap_2.SwapHelper; } });
class YokaiSDK {
    constructor(config) {
        this.rpcClient = new client_1.YokaiRPCClient({
            endpoint: config?.rpcEndpoint || 'https://app.yokairpc.io/api/rpc'
        });
        this.jupiterClient = new jupiter_1.JupiterClient(config?.jupiterEndpoint || 'https://lite-api.jup.ag/swap/v1');
        this.swapHelper = new swap_1.SwapHelper(this.rpcClient, this.jupiterClient);
    }
    /**
     * Get RPC client for low-level operations
     */
    getRPCClient() {
        return this.rpcClient;
    }
    /**
     * Get Jupiter client for advanced quote operations
     */
    getJupiterClient() {
        return this.jupiterClient;
    }
    /**
     * Execute a swap with MEV protection
     */
    async swap(params) {
        return this.swapHelper.swap(params);
    }
    /**
     * Get a quote for a swap
     */
    async getQuote(params) {
        return this.jupiterClient.getQuote(params);
    }
}
exports.YokaiSDK = YokaiSDK;
exports.default = YokaiSDK;
