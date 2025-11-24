import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';
import { YokaiRPCClient } from '@yokairpc/client';
import { JupiterClient } from './jupiter';
import { SwapParams, SwapResult } from './types';
import { getTokenBySymbol, getTokenByAddress, toLamports, fromLamports } from './tokens';

export class SwapHelper {
  private rpcClient: YokaiRPCClient;
  private jupiterClient: JupiterClient;

  constructor(rpcClient: YokaiRPCClient, jupiterClient: JupiterClient) {
    this.rpcClient = rpcClient;
    this.jupiterClient = jupiterClient;
  }

  async swap(params: SwapParams): Promise<SwapResult> {
    try {
      // Resolve token addresses
      const inputToken = getTokenBySymbol(params.inputToken) || 
                        getTokenByAddress(params.inputToken);
      const outputToken = getTokenBySymbol(params.outputToken) || 
                         getTokenByAddress(params.outputToken);

      if (!inputToken || !outputToken) {
        throw new Error('Invalid token');
      }

      // Convert amount to lamports
      const amountLamports = toLamports(params.amount, inputToken.decimals);

      // Get quote
      const quote = await this.jupiterClient.getQuote({
        inputMint: inputToken.address,
        outputMint: outputToken.address,
        amount: amountLamports,
        slippageBps: params.slippageBps || 50
      });

      // Get swap instructions
      const swapInstructions = await this.jupiterClient.getSwapInstructions(
        quote,
        params.wallet.publicKey.toBase58()
      );

      // Build transaction
      const transaction = new Transaction();
      
      // Add compute budget instructions
      if (swapInstructions.computeBudgetInstructions) {
        swapInstructions.computeBudgetInstructions.forEach((ix: any) => {
          transaction.add(this.deserializeInstruction(ix));
        });
      }

      // Add setup instructions
      if (swapInstructions.setupInstructions) {
        swapInstructions.setupInstructions.forEach((ix: any) => {
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
        outputAmount: fromLamports(quote.outAmount, outputToken.decimals),
        priceImpact: parseFloat(quote.priceImpactPct)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private deserializeInstruction(instruction: any): TransactionInstruction {
    return new TransactionInstruction({
      programId: new PublicKey(instruction.programId),
      keys: instruction.accounts.map((key: any) => ({
        pubkey: new PublicKey(key.pubkey),
        isSigner: key.isSigner,
        isWritable: key.isWritable
      })),
      data: Buffer.from(instruction.data, 'base64')
    });
  }
}