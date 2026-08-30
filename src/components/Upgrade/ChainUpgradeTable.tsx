import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Link from "@docusaurus/Link";
import styles from "./ChainUpgradeTable.module.css";

/** Strip any markup out of remote JSON values before rendering. */
function clean(value: any): string {
  return DOMPurify.sanitize(String(value ?? ""), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Fetch a Tendermint RPC path, trying multiple endpoints in order.
 * Returns parsed JSON or throws if all endpoints fail.
 */
async function fetchWithFallback(rpcs: string[], path: string): Promise<any> {
  for (const rpc of rpcs) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${rpc}${path}`, { signal: controller.signal });
      clearTimeout(tid);
      const json = await res.json();
      if (json?.result) return json;
    } catch {
      continue; // try next RPC
    }
  }
  throw new Error(`All ${rpcs.length} RPC endpoint(s) failed for ${path}`);
}

/**
 * Compute the average block time (in seconds) for a chain by sampling
 * recent blocks. Falls back to 6.5s if the RPC doesn't expose
 * /block?height=N (some LCD-only endpoints don't).
 */
async function getAverageBlockTime(
  rpcs: string[],
  latestHeight: number
): Promise<number> {
  const sampleOffsets = [1, 5, 20, 50, 100];
  try {
    const samples = await Promise.all(
      sampleOffsets.map(async (offset) => {
        const h = latestHeight - offset;
        if (h <= 0) return null;
        try {
          const json = await fetchWithFallback(rpcs, `/block?height=${h}`);
          const timeStr = json?.result?.block?.header?.time;
          if (!timeStr) return null;
          return { height: h, time: new Date(timeStr).getTime() };
        } catch {
          return null;
        }
      })
    );
    const valid = samples.filter(
      (s): s is { height: number; time: number } => s !== null
    );
    if (valid.length < 2) return 6.5;

    // Sort by block height ASC so delta = newer - older is positive.
    valid.sort((a, b) => a.height - b.height);

    let totalDeltaMs = 0;
    let totalBlocks = 0;
    for (let i = 1; i < valid.length; i++) {
      const dt = valid[i].time - valid[i - 1].time;
      const dh = valid[i].height - valid[i - 1].height;
      if (dt > 0 && dh > 0 && dt < 60 * 60 * 1000) {
        totalDeltaMs += dt;
        totalBlocks += dh;
      }
    }
    if (totalBlocks === 0) return 6.5;
    return totalDeltaMs / 1000 / totalBlocks;
  } catch {
    return 6.5;
  }
}

type UpgradeStatus = {
  label: string;
  className: string;
};

/**
 * Purely presentational: derive the status pill from values that are already
 * on the row. Rows whose RPCs all failed are surfaced as a FAULT pill so a
 * broken endpoint is never silently hidden from operators.
 */
function getStatus(chain: any): UpgradeStatus {
  if (
    chain.latestHeight === "Error" ||
    typeof chain.latestHeight !== "number" ||
    typeof chain.avgBlockTime !== "number"
  ) {
    return { label: "RPC Fault", className: styles.pillFault };
  }

  const remainingBlocks = Number(chain.target_height) - chain.latestHeight;
  if (!Number.isFinite(remainingBlocks) || remainingBlocks <= 0) {
    return { label: "Due Now", className: styles.pillDue };
  }

  const secondsLeft = remainingBlocks * chain.avgBlockTime;
  if (secondsLeft <= 3600) {
    return { label: "Imminent", className: styles.pillImminent };
  }
  if (secondsLeft <= 86400) {
    return { label: "Soon", className: styles.pillSoon };
  }
  return { label: "Scheduled", className: styles.pillScheduled };
}

export default function ChainUpgradeTable({
  chainType = "mainnet",
}: {
  chainType?: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch from runtime JSON (not build-time import) so data is always fresh
        const response = await fetch("/data/mainnetupgrade.json");
        const mainnetUpgrades = await response.json();
        const responseTestnet = await fetch("/data/testnetupgrade.json");
        const testnetUpgrades = await responseTestnet.json();

        const upgrades =
          chainType === "testnet" ? testnetUpgrades : mainnetUpgrades;

        if (!upgrades || upgrades.length === 0) {
          setData([]);
          setLoaded(true);
          return;
        }

        const results = await Promise.all(
          upgrades.map(async (chain: any) => {
            // Multi-RPC: prefer rpc_endpoints array, fall back to single rpc
            const rpcs: string[] =
              chain.rpc_endpoints?.length > 0
                ? chain.rpc_endpoints
                : chain.rpc
                  ? [chain.rpc]
                  : [];

            if (rpcs.length === 0) {
              return {
                ...chain,
                latestHeight: "Error",
                eta: "Error",
                timeLeft: "Error",
                avgBlockTime: "Error",
              };
            }

            try {
              const json = await fetchWithFallback(rpcs, "/status");
              const latestHeight = parseInt(
                json.result.sync_info.latest_block_height,
                10
              );
              const latestTime = new Date(
                json.result.sync_info.latest_block_time
              );

              // Hide items whose upgrade height has already been reached.
              if (latestHeight >= chain.target_height) {
                return null;
              }

              // Real-time block time calculation from recent samples
              const avgBlockTime = await getAverageBlockTime(
                rpcs,
                latestHeight
              );

              const remainingBlocks = chain.target_height - latestHeight;
              const secondsLeft = remainingBlocks * avgBlockTime;
              const eta = new Date(
                latestTime.getTime() + secondsLeft * 1000
              );

              const now = new Date();
              const diff = eta.getTime() - now.getTime();
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);

              return {
                ...chain,
                latestHeight,
                avgBlockTime,
                eta: eta.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
                timeLeft: `${days}d ${hours}h ${minutes}m`,
              };
            } catch (e) {
              // Keep entries with RPC errors visible so the operator can debug.
              return {
                ...chain,
                latestHeight: "Error",
                eta: "Error",
                timeLeft: "Error",
                avgBlockTime: "Error",
              };
            }
          })
        );

        const filtered = results.filter((item: any) => item !== null);
        setData(filtered);
        setLoaded(true);
      } catch (e) {
        console.error("fetchData error", e);
        setLoaded(true);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [chainType]);

  // Render nothing until first load completes.
  if (!loaded) return null;

  // No upcoming upgrades — quiet, self-explanatory panel instead of a bare gap.
  if (data.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <span className={styles.emptyGlyph} aria-hidden="true">
            ✓
          </span>
          <p className={styles.emptyTitle}>No upgrades scheduled</p>
          <p className={styles.emptyHint}>
            Every tracked {chainType === "testnet" ? "testnet" : "mainnet"} is
            running its current release. New upgrade proposals appear here as
            soon as they pass.
          </p>
          <span className={styles.emptyMeta}>refresh · 30s</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Keyboard-scrollable region needs a name so AT can announce it */}
      <div
        className={styles.scroller}
        tabIndex={0}
        role="region"
        aria-label={`${
          chainType === "testnet" ? "Testnet" : "Mainnet"
        } upgrade schedule (scrollable)`}
      >
        <table className={styles.table}>
          <caption className={styles.caption}>
            Upcoming {chainType === "testnet" ? "testnet" : "mainnet"} chain
            upgrades with estimated activation times. Refreshes every 30
            seconds.
          </caption>
          <thead>
            <tr className={styles.headRow}>
              <th scope="col" className={`${styles.head} ${styles.headNum}`}>
                #
              </th>
              <th scope="col" className={styles.head}>
                Network
              </th>
              <th scope="col" className={styles.head}>
                Proposal
              </th>
              <th scope="col" className={styles.head}>
                Block
              </th>
              <th scope="col" className={styles.head}>
                Avg Block Time
              </th>
              <th scope="col" className={styles.head}>
                Estimate Upgrade
              </th>
              <th scope="col" className={styles.head}>
                Your Local Time
              </th>
              <th scope="col" className={styles.head}>
                Version
              </th>
              <th scope="col" className={styles.head}>
                Status
              </th>
              <th scope="col" className={styles.head}>
                Guide
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((chain, idx) => {
              const status = getStatus(chain);
              const isFault = chain.avgBlockTime === "Error";
              return (
                <tr key={idx} className={styles.row}>
                  <td className={`${styles.cell} ${styles.rowNum}`}>
                    {idx + 1}
                  </td>
                  <th
                    scope="row"
                    className={`${styles.cell} ${styles.rowHead}`}
                  >
                    <Link href={chain.link} className={styles.network}>
                      {clean(chain.network)}
                    </Link>
                  </th>
                  <td className={styles.cell}>
                    <Link href={chain.proposal} className={styles.proposal}>
                      #{clean(chain.proposal_id)}
                    </Link>
                  </td>
                  <td className={`${styles.cell} ${styles.mono}`}>
                    {clean(chain.target_height)}
                  </td>
                  <td className={`${styles.cell} ${styles.monoSoft}`}>
                    {typeof chain.avgBlockTime === "number" ? (
                      `${chain.avgBlockTime.toFixed(1)}s`
                    ) : (
                      <span className={styles.fault}>
                        {clean(chain.avgBlockTime)}
                      </span>
                    )}
                  </td>
                  <td className={`${styles.cell} ${styles.countdown}`}>
                    {isFault ? (
                      <span className={styles.fault}>
                        {clean(chain.timeLeft)}
                      </span>
                    ) : (
                      clean(chain.timeLeft)
                    )}
                  </td>
                  <td className={`${styles.cell} ${styles.monoSoft}`}>
                    {isFault ? (
                      <span className={styles.fault}>{clean(chain.eta)}</span>
                    ) : (
                      clean(chain.eta)
                    )}
                  </td>
                  <td className={styles.cell}>
                    <span className={styles.version}>
                      {clean(chain.version)}
                    </span>
                  </td>
                  <td className={styles.cell}>
                    <span className={`${styles.pill} ${status.className}`}>
                      <span className={styles.pillDot} aria-hidden="true" />
                      {status.label}
                    </span>
                  </td>
                  <td className={styles.cell}>
                    <Link
                      href={`${chain.link}upgrade`}
                      className={styles.guide}
                    >
                      Guide
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
