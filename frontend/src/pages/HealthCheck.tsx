import { useState, useEffect } from "react";
import { checkHealth, checkHealthDb } from "../api/health";
import type { HealthDbResponse } from "../api/health";
import { config } from "../config";

export function HealthCheck() {
  const [health, setHealth] = useState<HealthDbResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true);
        setError(null);

        console.log("[HealthCheck] Starting health check...");
        console.log("[HealthCheck] API URL:", config.apiUrl);

        // First try with DB check
        try {
          console.log("[HealthCheck] Attempting /health/db...");
          const dbHealth = await checkHealthDb();
          console.log("[HealthCheck] /health/db response:", dbHealth);
          setHealth(dbHealth);
        } catch (dbError) {
          console.warn("[HealthCheck] /health/db failed:", dbError);
          // If DB check fails, try basic health
          console.log("[HealthCheck] Attempting /health...");
          const basicHealth = await checkHealth();
          console.log("[HealthCheck] /health response:", basicHealth);
          setHealth({
            ...basicHealth,
            database: "not checked",
          });
        }
      } catch (err) {
        console.error("[HealthCheck] All health checks failed:", err);
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  const handleRefresh = () => {
    setHealth(null);
    setLoading(true);
    setError(null);

    console.log("[HealthCheck] Manual refresh triggered");
    console.log("[HealthCheck] API URL:", config.apiUrl);

    checkHealthDb()
      .then((response) => {
        console.log("[HealthCheck] /health/db response:", response);
        setHealth(response);
      })
      .catch((dbError) => {
        console.warn("[HealthCheck] /health/db failed:", dbError);
        checkHealth()
          .then((basicHealth) => {
            console.log("[HealthCheck] /health response:", basicHealth);
            setHealth({ ...basicHealth, database: "not checked" });
          })
          .catch((err) => {
            console.error("[HealthCheck] All health checks failed:", err);
            setError(err instanceof Error ? err.message : "Connection failed");
          });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="health-check">
      <h1>Barber Reservation System</h1>
      <h2>System Health Status</h2>

      {loading && <p className="loading">Checking system health...</p>}

      {error && (
        <div className="status error">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <p className="api-url">
            <small>API URL: {config.apiUrl}</small>
          </p>
        </div>
      )}

      {health && !loading && (
        <div className={`status ${health.status === "healthy" ? "healthy" : "unhealthy"}`}>
          <table>
            <tbody>
              <tr>
                <td>Service:</td>
                <td>{health.service}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{health.status}</td>
              </tr>
              <tr>
                <td>Database:</td>
                <td>{health.database}</td>
              </tr>
              <tr>
                <td>API URL:</td>
                <td><small>{config.apiUrl}</small></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <button onClick={handleRefresh} disabled={loading}>
        {loading ? "Checking..." : "Refresh"}
      </button>
    </div>
  );
}
