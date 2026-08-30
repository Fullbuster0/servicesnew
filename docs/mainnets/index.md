---
title: "Mainnets"
sidebar_position: 2
sidebar_label: "Mainnets"
hide_table_of_contents: false
---

import ChainUpgradeTable from "@site/src/components/Upgrade/ChainUpgradeTable";

<div className="dx-hero">
  <span className="dx-hero__eyebrow">
    <span className="dx-hero__eyebrow-dot"></span>
    Production Networks
  </span>

<h1 className="dx-hero__title">⚡ Mainnets</h1>

  <p className="dx-hero__lede">
    Shazoes runs validator infrastructure built for <strong>stability, security and
    sustained performance</strong>. Our nodes stay online around the clock and every
    network we secure exposes the same public service surface to the community.
  </p>

  <ul className="dx-hero__stats">
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">21</span>
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
    <li className="dx-chip dx-chip--live">
      <span className="dx-chip__key">Class</span>
      <span className="dx-chip__val">mainnet</span>
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
    <span className="dx-section__hint">Available on every mainnet chain page.</span>
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
    <h2 className="dx-section__title">📡 Interchain mainnets upgrade watcher</h2>
    <span className="dx-section__hint">Live heights, refreshed on load.</span>
  </div>

  <p className="dx-lede">
    Track the latest upgrade proposals across every mainnet we support — target height,
    node version, and the estimated time remaining before the halt.
  </p>

<div className="dx-panel upgrade-watcher-wrapper">
  <ChainUpgradeTable chainType="mainnet" />
</div>
</div>

<div className="dx-callout">
  <span className="dx-callout__icon">💡</span>
  <div className="dx-callout__body">
    <span className="dx-callout__title">Before you upgrade</span>
    Build the exact version listed for the chain and stage it ahead of the upgrade
    height. Running ahead of a coordinated upgrade will stall or fork your node.
  </div>
</div>
