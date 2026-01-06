import { config } from "../config";

export interface HealthResponse {
  status: string;
  service: string;
}

export interface HealthDbResponse extends HealthResponse {
  database: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${config.apiUrl}/health`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

export async function checkHealthDb(): Promise<HealthDbResponse> {
  const response = await fetch(`${config.apiUrl}/health/db`);
  if (!response.ok) {
    throw new Error("Health check with DB failed");
  }
  return response.json();
}
