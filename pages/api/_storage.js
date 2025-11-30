// pages/api/_storage.js
// Simple in-memory store shared across requests in the same server instance
if (!global._miniAuditStore) {
  global._miniAuditStore = {
    versions: [],
  };
}
export default global._miniAuditStore;
