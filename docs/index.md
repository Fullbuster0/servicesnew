---
title: "Services Docs"
sidebar_position: 1
sidebar_label: "Overview"
hide_table_of_contents: false
---

<div className="dx-hero">
  <span className="dx-hero__eyebrow">
    <span className="dx-hero__eyebrow-dot"></span>
    Shazoes Infrastructure
  </span>

<h1 className="dx-hero__title">Services Documentation</h1>

  <p className="dx-hero__lede">
    Everything you need to run a node on the networks we validate — <strong>installation
    guides, snapshots, state-sync, addrbooks, live peers and upgrade tracking</strong>,
    kept in sync with our production infrastructure.
  </p>

  <ul className="dx-hero__stats">
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">21</span>
      <span className="dx-hero__stat-label">Mainnets</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">18</span>
      <span className="dx-hero__stat-label">Testnets</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">5</span>
      <span className="dx-hero__stat-label">Guides / chain</span>
    </li>
    <li className="dx-hero__stat">
      <span className="dx-hero__stat-value">24/7</span>
      <span className="dx-hero__stat-label">Public endpoints</span>
    </li>
  </ul>

  <div className="dx-hero__actions">
    <a className="dx-btn dx-btn--primary" href="/mainnets">Browse mainnets →</a>
    <a className="dx-btn dx-btn--ghost" href="/testnets">Browse testnets</a>
    <a className="dx-btn dx-btn--ghost" href="/relayers">IBC relayers</a>
  </div>
</div>

<div className="dx-section">
  <div className="dx-section__head">
    <h2 className="dx-section__title">Start here</h2>
    <span className="dx-section__hint">Pick the network class you are deploying against.</span>
  </div>

  <div className="dx-cards">
    <a className="dx-card" href="/mainnets">
      <span className="dx-card__kicker">Production</span>
      <span className="dx-card__title">⚡ Mainnets <span className="dx-card__arrow">→</span></span>
      <span className="dx-card__desc">
        Validator-grade guides for the live networks we secure, plus the interchain
        upgrade watcher for every tracked mainnet.
      </span>
    </a>
    <a className="dx-card" href="/testnets">
      <span className="dx-card__kicker">Pre-production</span>
      <span className="dx-card__title">🧪 Testnets <span className="dx-card__arrow">→</span></span>
      <span className="dx-card__desc">
        Incentivised and public testnets — the same service surface as mainnet, so you
        can rehearse upgrades before they ship.
      </span>
    </a>
    <a className="dx-card" href="/relayers">
      <span className="dx-card__kicker">Interoperability</span>
      <span className="dx-card__title">🔗 Relayers <span className="dx-card__arrow">→</span></span>
      <span className="dx-card__desc">
        The IBC paths we operate, the channels behind them, and the chains on each side
        of every connection.
      </span>
    </a>
  </div>
</div>

<hr className="dx-rule" />

<div className="dx-section">
  <div className="dx-section__head">
    <h2 className="dx-section__title">What every chain page ships with</h2>
    <span className="dx-section__hint">Identical structure across all networks.</span>
  </div>

  <ul className="dx-tiles">
    <li className="dx-tile dx-tile--blue">
      <span className="dx-tile__icon">⚙️</span>
      <span className="dx-tile__name">Node Installation</span>
      <span className="dx-tile__desc">Binary build, service file, seeds and peers.</span>
    </li>
    <li className="dx-tile dx-tile--violet">
      <span className="dx-tile__icon">📸</span>
      <span className="dx-tile__name">Snapshot</span>
      <span className="dx-tile__desc">Pruned archives refreshed on a fixed cadence.</span>
    </li>
    <li className="dx-tile dx-tile--cyan">
      <span className="dx-tile__icon">🔄</span>
      <span className="dx-tile__name">State Sync</span>
      <span className="dx-tile__desc">Trusted height and hash, wired to our RPC.</span>
    </li>
    <li className="dx-tile dx-tile--emerald">
      <span className="dx-tile__icon">📖</span>
      <span className="dx-tile__name">Addrbook</span>
      <span className="dx-tile__desc">Fresh address books for fast peer discovery.</span>
    </li>
    <li className="dx-tile dx-tile--blue">
      <span className="dx-tile__icon">👥</span>
      <span className="dx-tile__name">Live Peers</span>
      <span className="dx-tile__desc">Peer strings generated from live net_info.</span>
    </li>
    <li className="dx-tile dx-tile--amber">
      <span className="dx-tile__icon">⬆️</span>
      <span className="dx-tile__name">Upgrades</span>
      <span className="dx-tile__desc">Height countdowns and manual upgrade steps.</span>
    </li>
    <li className="dx-tile dx-tile--rose">
      <span className="dx-tile__icon">💻</span>
      <span className="dx-tile__name">Useful Commands</span>
      <span className="dx-tile__desc">Day-two ops: keys, staking, governance, debug.</span>
    </li>
    <li className="dx-tile dx-tile--cyan">
      <span className="dx-tile__icon">🌐</span>
      <span className="dx-tile__name">Public Endpoints</span>
      <span className="dx-tile__desc">API, RPC and gRPC you can point clients at.</span>
    </li>
    <li className="dx-tile dx-tile--violet">
      <span className="dx-tile__icon">🔍</span>
      <span className="dx-tile__name">Explorer</span>
      <span className="dx-tile__desc">Block, tx and validator lookups per network.</span>
    </li>
    <li className="dx-tile dx-tile--emerald">
      <span className="dx-tile__icon">🚰</span>
      <span className="dx-tile__name">Faucet</span>
      <span className="dx-tile__desc">Test tokens for the networks that provide them.</span>
    </li>
  </ul>
</div>

<hr className="dx-rule" />

<div className="dx-section">
  <div className="dx-section__head">
    <h2 className="dx-section__title">Bringing a node up</h2>
    <span className="dx-section__hint">The path most operators take.</span>
  </div>

  <ol className="dx-steps">
    <li className="dx-step">
      <span className="dx-step__title">Provision and install</span>
      <span className="dx-step__body">
        Follow the chain's <em>Node Installation</em> page: build the binary at the
        pinned version, initialise the home folder, and register the systemd service.
      </span>
    </li>
    <li className="dx-step">
      <span className="dx-step__title">Sync the chain</span>
      <span className="dx-step__body">
        Restore from our snapshot for the fastest path, or use state-sync when you only
        need recent state. Both flows live on the <em>Sync</em> page.
      </span>
    </li>
    <li className="dx-step">
      <span className="dx-step__title">Connect to the network</span>
      <span className="dx-step__body">
        Drop in the addrbook and the live peer string, then confirm the node is catching
        up before you expose anything publicly.
      </span>
    </li>
    <li className="dx-step">
      <span className="dx-step__title">Stay on top of upgrades</span>
      <span className="dx-step__body">
        The upgrade watcher on each landing page shows the target height and the
        estimated time remaining for every tracked network.
      </span>
    </li>
  </ol>
</div>

<div className="dx-callout dx-callout--warn">
  <span className="dx-callout__icon">⚠️</span>
  <div className="dx-callout__body">
    <span className="dx-callout__title">Version pinning matters</span>
    Always build the exact version listed on the chain page. Running ahead of a
    coordinated upgrade height will halt or fork your node.
  </div>
</div>
