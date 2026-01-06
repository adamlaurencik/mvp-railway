import { config } from "../config";

export interface HealthResponse {
  status: string;
  service: string;
}

export interface HealthDbResponse extends HealthResponse {
  database: string;
}

async function handleResponse<T>(response: Response, endpoint: string): Promise<T> {
  console.log(`[API] Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("[API] Expected JSON but got:", text.substring(0, 500));
    throw new Error(
      `Expected JSON response from ${endpoint}, but got ${contentType || "unknown content type"}. ` +
      `Check CORS settings and ensure backend is running at ${config.apiUrl}`
    );
  }

  const data = await response.json();
  console.log(`[API] Parsed JSON from ${endpoint}:`, data);
  return data;
}

export async function checkHealth(): Promise<HealthResponse> {
  const url = `${config.apiUrl}/health`;
  console.log(`[API] Fetching ${url}`);

  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });
    return handleResponse<HealthResponse>(response, "/health");
  } catch (error) {
    console.error("[API] Fetch error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to backend at ${config.apiUrl}. ` +
        `Make sure the backend is running and CORS is configured.`
      );
    }
    throw error;
  }
}

export async function checkHealthDb(): Promise<HealthDbResponse> {
  const url = `${config.apiUrl}/health/db`;
  console.log(`[API] Fetching ${url}`);

  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });
    return handleResponse<HealthDbResponse>(response, "/health/db");
  } catch (error) {
    console.error("[API] Fetch error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to backend at ${config.apiUrl}. ` +
        `Make sure the backend is running and CORS is configured.`
      );
    }
    throw error;
  }
}
