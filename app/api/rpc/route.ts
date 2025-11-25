import { NextRequest, NextResponse } from 'next/server';

function getBackendRPC(): string {
  const endpoint = process.env.BACKEND_RPC_ENDPOINT;
  
  if (!endpoint) {
    console.error('❌ BACKEND_RPC_ENDPOINT not set!');
    throw new Error('Backend RPC endpoint not configured');
  }
  
  return endpoint;
}

const YOKAI_HEADERS = {
  'X-RPC-Provider': 'YOKAI',
  'X-Privacy-Shield': 'enabled',
  'X-MEV-Protection': 'active',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const isValidRPCRequest = (body: any): boolean => {
  if (!body || typeof body !== 'object') return false;
  if (!body.jsonrpc || body.jsonrpc !== '2.0') return false;
  if (!body.method || typeof body.method !== 'string') return false;
  return true;
};

export async function GET(request: NextRequest) {
  const info = {
    service: 'YOKAI RPC',
    version: '1.0.0',
    status: 'operational',
    endpoint: 'https://app.yokairpc.io/api/rpc',
    description: 'Privacy-first Solana RPC with MEV protection',
    features: {
      mev_protection: true,
      sub_100ms_latency: true,
      free_unlimited: true,
      standard_solana_rpc: true,
    },
    usage: {
      format: 'JSON-RPC 2.0',
      method: 'POST',
      content_type: 'application/json',
      example: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth',
        params: [],
      },
    },
    documentation: 'https://app.yokairpc.io/docs.html',
    packages: {
      client: '@yokairpc/client',
      sdk: '@yokairpc/sdk',
      install_client: 'npm install @yokairpc/client',
      install_sdk: 'npm install @yokairpc/sdk',
    },
    links: {
      website: 'https://app.yokairpc.io',
      npm_client: 'https://www.npmjs.com/package/@yokairpc/client',
      npm_sdk: 'https://www.npmjs.com/package/@yokairpc/sdk',
      github: 'https://github.com/yokairpc/yokai-rpc',
      twitter: 'https://x.com/yokairpcdotio',
    },
  };

  return NextResponse.json(info, {
    status: 200,
    headers: {
      ...YOKAI_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!isValidRPCRequest(body)) {
      return NextResponse.json(
        { 
          jsonrpc: '2.0',
          error: { code: -32600, message: 'Invalid Request' },
          id: body.id || null 
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    const backendRPC = getBackendRPC();
    
    const response = await fetch(backendRPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend RPC request failed: ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...YOKAI_HEADERS,
        'X-Response-Time': `${latency}ms`,
        'Content-Type': 'application/json',
      }
    });
      
  } catch (error: any) {
    console.error('[YOKAI RPC ERROR]', error.message);
    
    return NextResponse.json(
      { 
        jsonrpc: '2.0',
        error: { 
          code: -32603, 
          message: error.message || 'Internal error'
        },
        id: null 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: YOKAI_HEADERS,
  });
}