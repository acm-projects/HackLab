import { Request as ExpressRequest, Response as ExpressResponse } from "express";
/**
 * Encodes an object as url-encoded string.
 */
export declare function encodeUrlEncoded(object?: Record<string, any>): string;
/**
 * Adapts an Express Request to a Web Request, returning the Web Request.
 */
export declare function toWebRequest(req: ExpressRequest): Request;
/**
 * Adapts a Web Response to an Express Response, invoking appropriate
 * Express response methods to handle the response.
 */
export declare function toExpressResponse(response: Response, res: ExpressResponse): Promise<void>;
//# sourceMappingURL=http-api-adapters.d.ts.map