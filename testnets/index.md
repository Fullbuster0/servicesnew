---
sidebar_position: 2
title: "Testnets"
---

import ChainUpgradeTable from "@site/src/components/Upgrade/ChainUpgradeTable";

<div className="dx-hero">
  <span className="dx-hero__eyebrow"><span className="dx-hero__eyebrow-dot"></span>Test Networks</span>

# 🧪 Testnets

  <div className="dx-hero__lede">
    Shazoes validates incentivised and public testnets with the same infrastructure
    discipline as production — <strong>pinned versions, monitored nodes, real
    endpoints</strong>. Break things here, not on mainnet.
  </div>

  <ul className="dx-hero__stats">
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">18</span>
      <span className="dx-hero__stat-label">Networks documented</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">5</span>
      <span className="dx-hero__stat-label">Guides per network</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">3</span>
      <span className="dx-hero__stat-label">Endpoint types</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">24/7</span>
      <span className="dx-hero__stat-label">Uptime target</span>
    </li>
  </ul>

  <ul className="dx-meta">
    <li className="dx-chip dx-chip--test">
      <span className="dx-chip__key">Class</span>
      <span className="dx-chip__val">testnet</span>
    </li>
    <li className="dx-chip">
      <span className="dx-chip__key">Endpoints</span>
      <span className="dx-chip__val">API · RPC · gRPC</span>
    </li>
    <li className="dx-chip">
      <span className="dx-chip__key">Snapshots</span>
      <span className="dx-chip__val">pruned</span>
    </li>
  </ul>
</div>

<div className="dx-section">
  <div className="dx-section__head">
    <h2 className="dx-section__title">🛠️ Our services include</h2>
    <span className="dx-section__hint">Available on every testnet chain page.</span>
  </div>

  <ul className="dx-tiles">
    <li className="dx-tile dx-tile--blue">
      <span className="dx-tile__icon">⚙️</span>
      <span className="dx-tile__name">Node Installation</span>
      <span className="dx-tile__desc">Pinned binary, systemd unit, seeds.</span>
    </li>
    <li className="dx-tile dx-tile--violet">
      <span className="dx-tile__icon">📸</span>
      <span className="dx-tile__name">Snapshot</span>
      <span className="dx-tile__desc">Pruned archives, refreshed regularly.</span>
    </li>
    <li className="dx-tile dx-tile--cyan">
      <span className="dx-tile__icon">🔄</span>
      <span className="dx-tile__name">State Sync</span>
      <span className="dx-tile__desc">Trust height and hash from our RPC.</span>
    </li>
    <li className="dx-tile dx-tile--emerald">
      <span className="dx-tile__icon">📖</span>
      <span className="dx-tile__name">Addrbook</span>
      <span className="dx-tile__desc">Warm address book for peer discovery.</span>
    </li>
    <li className="dx-tile dx-tile--blue">
      <span className="dx-tile__icon">👥</span>
      <span className="dx-tile__name">Live Peers</span>
      <span className="dx-tile__desc">Peer string built from live net_info.</span>
    </li>
    <li className="dx-tile dx-tile--amber">
      <span className="dx-tile__icon">⬆️</span>
      <span className="dx-tile__name">Last Upgrade</span>
      <span className="dx-tile__desc">Target height plus manual steps.</span>
    </li>
    <li className="dx-tile dx-tile--rose">
      <span className="dx-tile__icon">💻</span>
      <span className="dx-tile__name">Useful Commands</span>
      <span className="dx-tile__desc">Keys, staking, governance, debugging.</span>
    </li>
    <li className="dx-tile dx-tile--cyan">
      <span className="dx-tile__icon">🔗</span>
      <span className="dx-tile__name">Relayer</span>
      <span className="dx-tile__desc">IBC paths and channels we operate.</span>
    </li>
    <li className="dx-tile dx-tile--violet">
      <span className="dx-tile__icon">🔍</span>
      <span className="dx-tile__name">Explorer</span>
      <span className="dx-tile__desc">Blocks, txs and validator lookups.</span>
    </li>
    <li className="dx-tile dx-tile--emerald">
      <span className="dx-tile__icon">📦</span>
      <span className="dx-tile__name">Etc</span>
      <span className="dx-tile__desc">Genesis files, tooling and extras.</span>
    </li>
  </ul>
</div>

<hr className="dx-rule" />

<div className="dx-section">
  <div className="dx-section__head">
    <h2 className="dx-section__title">📡 Interchain testnets upgrade watcher</h2>
    <span className="dx-section__hint">Live heights, refreshed on load.</span>
  </div>

  <div className="dx-lede">
    Track the latest upgrade proposals across every testnet we support — target height,
    node version, and the estimated time remaining before the halt.
  </div>

<div className="dx-panel upgrade-watcher-wrapper">
  <ChainUpgradeTable chainType="testnet" />
</div>
</div>

<div className="dx-callout">
  <span className="dx-callout__icon">💡</span>
  <div className="dx-callout__body">
    <span className="dx-callout__title">Before you upgrade</span>
    Testnet upgrades land fast and often without notice. Build the exact version
    listed and stage it before the height — a late binary means a stalled node.
  </div>
</div>
