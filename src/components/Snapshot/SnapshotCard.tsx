import React, { useCallback, useEffect, useState } from "react";
import styles from "./SnapshotCard.module.css";

/**
 * Snapshot metadata JSON shape (as published at
 * https://snapshot.shazoes.xyz/<net>/metadata-<chain>.json).
 * Every field is optional on purpose — a partially written file must still render.
 */
interface SnapshotMetadata {
  chain?: string;
  height?: string | number;
  timestamp?: string;
  size?: string;
  file?: string;
  db?: string;
}

export interface SnapshotCardProps {
  /** Chain slug, used for the header when the JSON has no `chain` field. */
  chain?: string;
  /** Metadata JSON URL, polled every 30s with cache: "no-store". */
  jsonUrl: string;
  /** Optional base URL for the snapshot archive; defaults to the JSON's directory. */
  snapshotUrlPrefix?: string;
}

type Phase = "loading" | "ready" | "error";

/** "seda" → "Seda", "push-chain" → "Push Chain" */
function prettifyChain(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Group a block height for readability; leaves non-numeric values untouched. */
function formatHeight(height: string | number | undefined): string {
  if (height === undefined || height === null || height === "") return "—";
  const raw = String(height).trim();
  if (!/^\d+$/.test(raw)) return raw;
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Directory portion of the metadata URL, used as the archive base. */
function deriveSnapshotBase(jsonUrl: string, prefix?: string): string {
  if (prefix) return prefix.replace(/\/+$/, "");
  const cut = jsonUrl.lastIndexOf("/");
  return cut > 0 ? jsonUrl.slice(0, cut) : jsonUrl;
}

export default function SnapshotCard({
  chain,
  jsonUrl,
  snapshotUrlPrefix,
}: SnapshotCardProps) {
  const [data, setData] = useState<SnapshotMetadata | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${jsonUrl}?_=${Date.now()}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Fetch error");
          }
          return res.json();
        })
        .then((json) => {
          setData(json);
          setError(false);
        })
        .catch(() => {
          setError(true);
        });
    };

    fetchData(); // initial fetch on mount

    const interval = setInterval(fetchData, 30000); // refetch every 30s

    return () => clearInterval(interval); // cleanup on unmount
  }, [jsonUrl]);

  const phase: Phase = data ? "ready" : error ? "error" : "loading";

  const chainSlug = data?.chain || chain || "";
  const displayChain = prettifyChain(chainSlug || "Snapshot");

  const file = data?.file ?? (chain ? `snapshot-${chain}.tar.lz4` : "");
  const downloadUrl = file
    ? `${deriveSnapshotBase(jsonUrl, snapshotUrlPrefix)}/${file}`
    : "";
  const command = downloadUrl ? `aria2c -x 8 -s 8 ${downloadUrl}` : "";

  const handleCopy = useCallback(() => {
    if (!command) return;
    const clipboard =
      typeof navigator !== "undefined" ? navigator.clipboard : undefined;
    if (!clipboard?.writeText) return;
    clipboard
      .writeText(command)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, [command]);

  // Reset the "copied" affordance whenever the command itself changes.
  useEffect(() => {
    setCopied(false);
  }, [command]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  /* ------------------------------ LOADING ------------------------------ */
  if (phase === "loading") {
    return (
      <div
        className={`${styles.panel} ${styles.panelLoading}`}
        aria-busy="true"
        aria-live="polite"
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>Snapshot</span>
            <div className={styles.titleRow}>
              <span
                className={`${styles.placeholder} ${styles.placeholderTitle}`}
              />
              <span
                className={`${styles.placeholder} ${styles.placeholderTag}`}
              />
            </div>
          </div>
          <span className={`${styles.status} ${styles.statusIdle}`}>
            <span className={styles.dot} />
            Loading
          </span>
        </div>

        <div className={styles.grid}>
          {["Height", "Updated", "Size", "Database"].map((label) => (
            <div className={styles.row} key={label}>
              <span className={styles.key}>{label}</span>
              <span
                className={`${styles.placeholder} ${styles.placeholderValue}`}
              />
            </div>
          ))}
        </div>

        <div className={styles.command}>
          <div className={styles.commandHead}>
            <span className={styles.commandLabel}>Download command</span>
          </div>
          <div
            className={`${styles.placeholder} ${styles.placeholderCommand}`}
          />
        </div>

        <div className={styles.footnote}>
          Fetching snapshot metadata&nbsp;…
        </div>
      </div>
    );
  }

  /* ------------------------------- ERROR ------------------------------- */
  if (phase === "error") {
    return (
      <div
        className={`${styles.panel} ${styles.panelError}`}
        role="status"
        aria-live="polite"
      >
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>Snapshot</span>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{displayChain}</h3>
              {chain ? <code className={styles.chainTag}>{chain}</code> : null}
            </div>
          </div>
          <span className={`${styles.status} ${styles.statusDown}`}>
            <span className={styles.dot} />
            Unavailable
          </span>
        </div>

        <div className={styles.errorBody}>
          <span className={styles.errorTitle}>
            Snapshot metadata unavailable
          </span>
          <span className={styles.errorText}>
            The metadata file could not be read, so height, age and size are not
            being shown. This usually means no snapshot is currently published
            for this network. Retrying automatically every 30&nbsp;seconds.
          </span>
          <span className={styles.errorMeta}>{jsonUrl}</span>
        </div>
      </div>
    );
  }

  /* ------------------------------- READY ------------------------------- */
  const height = formatHeight(data?.height);
  const size = data?.size ?? "—";
  const db = data?.db ?? "goleveldb";

  const timestampMs = data?.timestamp ? new Date(data.timestamp).getTime() : NaN;
  const hasTimestamp = !isNaN(timestampMs);
  const diffMs = Date.now() - (hasTimestamp ? timestampMs : 0);
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const formattedDiff =
    hours > 0
      ? `${hours}h ${minutes}m ago`
      : diffMinutes < 1
        ? "just now"
        : `${diffMinutes} minutes ago`;

  // Fresh under 12h, stale beyond that. Without a timestamp we say nothing
  // rather than guessing — an unknown age is not the same as a stale snapshot.
  const freshness: "fresh" | "stale" | "unknown" = !hasTimestamp
    ? "unknown"
    : diffMinutes < 720
      ? "fresh"
      : "stale";
  const statusClass =
    freshness === "fresh"
      ? styles.statusOk
      : freshness === "stale"
        ? styles.statusStale
        : styles.statusIdle;
  const statusLabel =
    freshness === "fresh"
      ? "Fresh"
      : freshness === "stale"
        ? "Stale"
        : "Age unknown";

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.eyebrow}>Snapshot</span>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{displayChain}</h3>
            {chainSlug ? (
              <code className={styles.chainTag}>{chainSlug}</code>
            ) : null}
          </div>
        </div>
        <span className={`${styles.status} ${statusClass}`}>
          <span className={styles.dot} />
          {statusLabel}
        </span>
      </div>

      <div className={styles.grid}>
        <div className={styles.row}>
          <span className={styles.key}>Height</span>
          <span className={styles.value}>{height}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>Updated</span>
          <span className={styles.value}>
            {hasTimestamp ? formattedDiff : "—"}
          </span>
          {hasTimestamp ? (
            <span className={styles.valueSub}>
              {new Date(timestampMs).toISOString().replace("T", " ").slice(0, 19)}{" "}
              UTC
            </span>
          ) : null}
        </div>
        <div className={styles.row}>
          <span className={styles.key}>Size</span>
          <span className={styles.value}>{size}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>Database</span>
          <span className={`${styles.value} ${styles.valueMuted}`}>{db}</span>
        </div>
      </div>

      {command ? (
        <div className={styles.command}>
          <div className={styles.commandHead}>
            <span className={styles.commandLabel}>Download command</span>
            <button
              type="button"
              onClick={handleCopy}
              className={
                copied
                  ? `${styles.copyButton} ${styles.copyButtonDone}`
                  : styles.copyButton
              }
              aria-label="Copy snapshot download command"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className={styles.commandBlock}>
            <code>{command}</code>
          </pre>
        </div>
      ) : null}

      {file ? (
        <div className={styles.footnote}>
          Archive:&nbsp;
          <span className={styles.footnoteMono}>{file}</span>
        </div>
      ) : null}
    </div>
  );
}
