import { useState, useEffect } from "react";
import { checkHealth, checkHealthDb } from "../api/health";
import type { HealthDbResponse } from "../api/health";

export function HealthCheck() {
  const [health, setHealth] = useState<HealthDbResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true);
        setError(null);

        // First try with DB check
        try {
          const dbHealth = await checkHealthDb();
          setHealth(dbHealth);
        } catch (_) {
          // If DB check fails, try basic health
          const basicHealth = await checkHealth();
          setHealth({
            ...basicHealth,
            database: "not checked",
          });
        }
      } catch (err) {
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

    checkHealthDb()
      .then(setHealth)
      .catch(() => {
        checkHealth()
          .then((basicHealth) =>
            setHealth({ ...basicHealth, database: "not checked" })
          )
          .catch((err) =>
            setError(err instanceof Error ? err.message : "Connection failed")
          );
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
          <p>Make sure the backend server is running on http://localhost:8000</p>
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
