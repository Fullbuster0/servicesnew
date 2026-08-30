import React, { useEffect, useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { expandRpcFallbacks } from "./rpcFallbackMap";
import styles from "./LivePeers.module.css";

interface LivePeersProps {
  /** Primary RPC (string) or ordered list of RPCs to try. */
  rpc: string | string[];
  /** Optional extra fallback RPCs (tried after `rpc`). */
  rpcs?: string[];
  homeFolder?: string;
  binaryName?: string;
  maxPeers?: number;
}

type Status = "loading" | "ok" | "error";

function normalizeRpcList(
  rpc: string | string[] | undefined,
  extra?: string[],
): string[] {
  const primary = Array.isArray(rpc) ? rpc : rpc ? [rpc] : [];
  const first = primary[0] || "";
  const rest = [...primary.slice(1), ...(extra || [])];
  if (!first && rest.length === 0) return [];
  // expandRpcFallbacks puts primary first, then known map peers, then extras
  return expandRpcFallbacks(first || rest[0], [
    ...(first ? rest : rest.slice(1)),
  ]);
}

async function fetchNetInfo(rpcBase: string, timeoutMs = 8000): Promise<any> {
  const base = rpcBase.replace(/\/+$/, "");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const response = await fetch(`${base}/net_info`, {
      signal: ctrl.signal,
      // CORS must allow browser; many public RPCs do
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function peersFromNetInfo(data: any): string[] {
  const raw = data?.result?.peers || data?.peers || [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((peer: any) => {
      const id = peer?.node_info?.id;
      const ip = peer?.remote_ip;
      const port = peer?.node_info?.listen_addr?.split(":").pop();
      if (!id || !ip || !port) return null;
      return `${id}@${ip}:${port}`;
    })
    .filter(Boolean) as string[];
}

function shuffleArray(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Compact display form of an RPC URL — protocol stripped, no trailing slash. */
function prettyEndpoint(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export default function LivePeers({
  rpc,
  rpcs,
  homeFolder = "homeFolder",
  binaryName = "binaryName",
  maxPeers = 25,
}: LivePeersProps) {
  const [peersOnly, setPeersOnly] = useState("");
  const [scriptOutput, setScriptOutput] = useState("");
  const [peerCount, setPeerCount] = useState(0);
  const [usedPeerCount, setUsedPeerCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [triedCount, setTriedCount] = useState(0);
  const [totalEndpoints, setTotalEndpoints] = useState(0);
  const [activeEndpoint, setActiveEndpoint] = useState("");
  const [sourceEndpoint, setSourceEndpoint] = useState("");
  const [errorList, setErrorList] = useState<string[]>([]);

  useEffect(() => {
    const endpoints = normalizeRpcList(rpc, rpcs);
    setTotalEndpoints(endpoints.length);
    if (endpoints.length === 0) {
      setStatus("error");
      setErrorList([]);
      return;
    }

    let cancelled = false;

    async function fetchPeers() {
      setStatus("loading");
      setErrorList([]);
      setTriedCount(0);
      setSourceEndpoint("");

      const errors: string[] = [];

      for (let i = 0; i < endpoints.length; i++) {
        if (cancelled) return;
        const endpoint = endpoints[i];
        setTriedCount(i + 1);
        setActiveEndpoint(endpoint);
        try {
          const data = await fetchNetInfo(endpoint);
          const allPeers = peersFromNetInfo(data);
          if (allPeers.length === 0) {
            // Reachable but no peers — never render an empty box. Try the next
            // endpoint; if this was the last one the loop ends in the honest
            // "no endpoint responded" state.
            errors.push(`${endpoint}: empty peer list`);
            continue;
          }

          if (cancelled) return;

          const shuffledPeers = shuffleArray(allPeers).slice(0, maxPeers);
          const peersString = shuffledPeers.join(",");

          setPeerCount(allPeers.length);
          setUsedPeerCount(shuffledPeers.length);
          setPeersOnly(peersString);
          setSourceEndpoint(endpoint);
          setScriptOutput(
            `PEERS="${peersString}"
sed -i 's|^persistent_peers *=.*|persistent_peers = "'$PEERS'"|' $HOME/${homeFolder}/config/config.toml

sudo systemctl restart ${binaryName} && sudo journalctl -u ${binaryName} -f --no-hostname -o cat`,
          );
          setStatus("ok");
          return;
        } catch (err: any) {
          const msg =
            err?.name === "AbortError"
              ? "timeout"
              : err?.message || String(err);
          errors.push(`${endpoint}: ${msg}`);
          console.warn(`[LivePeers] RPC failed (${i + 1}/${endpoints.length}):`, endpoint, msg);
        }
      }

      if (cancelled) return;
      setStatus("error");
      setErrorList(errors.slice(-3));
    }

    fetchPeers();
    return () => {
      cancelled = true;
    };
  }, [rpc, rpcs, homeFolder, binaryName, maxPeers]);

  /* ------------------------------- FAILED ------------------------------- */
  if (status === "error") {
    // Distinguish "nothing answered" from "answered but returned no peers" so
    // the message is never misleading.
    const noEndpoints = totalEndpoints === 0;
    const answeredButEmpty =
      !noEndpoints &&
      errorList.length > 0 &&
      errorList.every((line) => line.endsWith("empty peer list"));
    const failTitle = noEndpoints
      ? "No RPC endpoint configured"
      : answeredButEmpty
        ? "No peers returned by any RPC endpoint"
        : "No RPC endpoint responded";
    return (
      <div className={styles.wrap}>
        <div className={styles.statusBar}>
          <span className={`${styles.chip} ${styles.chipOffline}`}>
            <span className={styles.chipDot} />
            Offline
          </span>
          <span className={styles.endpointBox}>
            <span className={styles.endpointLabel}>RPC source</span>
            <span className={`${styles.endpointValue} ${styles.endpointMuted}`}>
              no endpoint responded
            </span>
          </span>
          <span className={styles.countPill}>
            <span className={styles.countNum}>0</span>
            <span className={styles.countUnit}>peers</span>
          </span>
        </div>

        <div className={styles.fail}>
          <span className={styles.failTitle}>{failTitle}</span>
          {noEndpoints ? (
            <p className={styles.failBody}>
              This component received no usable RPC URL, so nothing was
              requested. Pass an <code>rpc</code> (and optionally{" "}
              <code>rpcs</code>) prop.
            </p>
          ) : (
            <p className={styles.failBody}>
              Tried {triedCount || totalEndpoints} of {totalEndpoints} RPC
              endpoint{totalEndpoints === 1 ? "" : "s"}, sequentially
              {answeredButEmpty
                ? " — each one answered with an empty peer list."
                : " — every one failed (node down, CORS blocked, or network error)."}{" "}
              No peer list is shown because there is no live data to show.
            </p>
          )}
          {errorList.length > 0 ? (
            <ul className={styles.failList}>
              {errorList.map((line, idx) => (
                <li key={`${idx}-${line}`} className={styles.failItem}>
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
          {noEndpoints ? null : (
            <p className={styles.failHint}>
              Tip: open the RPC <code>/net_info</code> URL in a new tab — if it
              fails there too, the node is down.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------ LOADING ------------------------------ */
  if (status === "loading") {
    return (
      <div className={styles.wrap}>
        <div className={styles.statusBar}>
          <span className={`${styles.chip} ${styles.chipPending}`}>
            <span className={styles.chipDot} />
            Checking
          </span>
          <span className={styles.endpointBox}>
            <span className={styles.endpointLabel}>RPC source</span>
            <span className={`${styles.endpointValue} ${styles.endpointMuted}`}>
              {activeEndpoint ? prettyEndpoint(activeEndpoint) : "resolving…"}
            </span>
          </span>
          <span className={styles.countPill}>
            <span className={styles.countNum}>—</span>
            <span className={styles.countUnit}>peers</span>
          </span>
        </div>

        <div className={styles.loading}>
          <span className={styles.loadingText}>Fetching peers…</span>
          <span className={styles.loadingMeta}>
            endpoint {triedCount || 1}/{totalEndpoints || 1} · sequential, no
            retries
          </span>
        </div>
      </div>
    );
  }

  /* -------------------------------- OK -------------------------------- */
  return (
    <div className={styles.wrap}>
      <div className={styles.statusBar}>
        <span className={`${styles.chip} ${styles.chipOnline}`}>
          <span className={styles.chipDot} />
          Online
        </span>
        <span className={styles.endpointBox}>
          <span className={styles.endpointLabel}>Answered by</span>
          <a
            className={styles.endpointValue}
            href={`${sourceEndpoint.replace(/\/+$/, "")}/net_info`}
            target="_blank"
            rel="noreferrer noopener"
            title={sourceEndpoint}
          >
            {prettyEndpoint(sourceEndpoint)}
          </a>
        </span>
        <span
          className={styles.countPill}
          title={`${usedPeerCount} peers listed${
            peerCount > usedPeerCount ? ` of ${peerCount} connected` : ""
          }`}
        >
          <span className={styles.countNum}>{usedPeerCount}</span>
          {peerCount > usedPeerCount ? (
            <span className={styles.countTotal}>/{peerCount}</span>
          ) : null}
          <span className={styles.countUnit}>peers</span>
        </span>
      </div>

      <div className={styles.frame}>
        <div className={styles.frameHead}>
          <span className={styles.frameTitle}>persistent_peers</span>
          <span className={styles.frameHint}>copy &amp; paste</span>
        </div>
        <div className={styles.frameBody}>
          <CodeBlock language="bash">{peersOnly}</CodeBlock>
        </div>
      </div>

      <div className={styles.frame}>
        <div className={styles.frameHead}>
          <span className={styles.frameTitle}>apply to config.toml</span>
          <span className={styles.frameHint}>then restart</span>
        </div>
        <div className={styles.frameBody}>
          <CodeBlock language="bash">{scriptOutput}</CodeBlock>
        </div>
      </div>
    </div>
  );
}
