/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>An official <a href="https://www.postgresql.org/">PostgreSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.postgresql.org/">
 *   <img style={{display: "block"}} src="/img/adapters/pg.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/pg-adapter pg
 * ```
 *
 * @module @auth/pg-adapter
 */
import type { Adapter } from "@auth/core/adapters";
import type { Pool } from "pg";
export declare function mapExpiresAt(account: any): any;
export default function PostgresAdapter(client: Pool): Adapter;
//# sourceMappingURL=index.d.ts.map