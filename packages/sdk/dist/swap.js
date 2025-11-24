"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapHelper = void 0;
const web3_js_1 = require("@solana/web3.js");
const tokens_1 = require("./tokens");
class SwapHelper {
    constructor(rpcClient, jupiterClient) {
        this.rpcClient = rpcClient;
        this.jupiterClient = jupiterClient;
    }
    async swap(params) {
        try {
            // Resolve token addresses
            const inputToken = (0, tokens_1.getTokenBySymbol)(params.inputToken) ||
                (0, tokens_1.getTokenByAddress)(params.inputToken);
            const outputToken = (0, tokens_1.getTokenBySymbol)(params.outputToken) ||
                (0, tokens_1.getTokenByAddress)(params.outputToken);
            if (!inputToken || !outputToken) {
                throw new Error('Invalid token');
            }
            // Convert amount to lamports
            const amountLamports = (0, tokens_1.toLamports)(params.amount, inputToken.decimals);
            // Get quote
            const quote = await this.jupiterClient.getQuote({
                inputMint: inputToken.address,
                outputMint: outputToken.address,
                amount: amountLamports,
                slippageBps: params.slippageBps || 50
            });
            // Get swap instructions
            const swapInstructions = await this.jupiterClient.getSwapInstructions(quote, params.wallet.publicKey.toBase58());
            // Build transaction
            const transaction = new web3_js_1.Transaction();
            // Add compute budget instructions
            if (swapInstructions.computeBudgetInstructions) {
                swapInstructions.computeBudgetInstructions.forEach((ix) => {
                    transaction.add(this.deserializeInstruction(ix));
                });
            }
            // Add setup instructions
            if (swapInstructions.setupInstructions) {
                swapInstructions.setupInstructions.forEach((ix) => {
                    transaction.add(this.deserializeInstruction(ix));
                });
            }
            // Add swap instruction
            transaction.add(this.deserializeInstruction(swapInstructions.swapInstruction));
            // Add cleanup instruction
            if (swapInstructions.cleanupInstruction) {
                transaction.add(this.deserializeInstruction(swapInstructions.cleanupInstruction));
            }
            // Get connection and set recent blockhash
            const connection = this.rpcClient.getConnection();
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = params.wallet.publicKey;
            // Sign transaction
            const signedTx = await params.wallet.signTransaction(transaction);
            // Send via YOKAI RPC with MEV protection
            const signature = await this.rpcClient.sendTransaction(signedTx, params.options);
            return {
                success: true,
                signature,
                inputAmount: params.amount,
                outputAmount: (0, tokens_1.fromLamports)(quote.outAmount, outputToken.decimals),
                priceImpact: parseFloat(quote.priceImpactPct)
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    deserializeInstruction(instruction) {
        return new web3_js_1.TransactionInstruction({
            programId: new web3_js_1.PublicKey(instruction.programId),
            keys: instruction.accounts.map((key) => ({
                pubkey: new web3_js_1.PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable
            })),
            data: Buffer.from(instruction.data, 'base64')
        });
    }
}
exports.SwapHelper = SwapHelper;
