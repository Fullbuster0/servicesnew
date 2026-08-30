import React from "react";
import Link from "@docusaurus/Link";
import { FaDiscord, FaEnvelope, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type ExternalLink = { label: string; href: string };

const NETWORK_LINKS: { label: string; to: string }[] = [
  { label: "Mainnets", to: "/mainnets" },
  { label: "Testnets", to: "/testnets" },
  { label: "Relayers", to: "/relayers" },
];

const SERVICE_LINKS: ExternalLink[] = [
  { label: "Explorer", href: "https://explorer.shazoes.xyz" },
  { label: "Monitoring Uptime", href: "https://monitor.shazoes.xyz" },
  { label: "Faucet", href: "https://faucet.shazoes.xyz" },
];

const SOCIALS = [
  {
    label: "X (Twitter)",
    href: "https://x.com/shazoes",
    icon: <FaXTwitter size={18} />,
  },
  {
    label: "Discord",
    href: "http://discordapp.com/users/906483432811561000",
    icon: <FaDiscord size={18} />,
  },
  {
    label: "Telegram",
    href: "https://t.me/shazoes",
    icon: <FaTelegram size={18} />,
  },
  {
    label: "Email",
    href: "mailto:hello@shazoes.xyz",
    icon: <FaEnvelope size={18} />,
  },
];

const Footer = (): React.ReactNode => {
  return (
    <footer className="footer">
      <div className="sz-footer">
        <div className="sz-footer__glow" />
        <div className="sz-footer__inner">
          <div className="sz-footer__grid">
            {/* Brand */}
            <div>
              <p className="sz-footer__wordmark">Shazoes</p>
              <p className="sz-footer__blurb">
                Independent validator and public infrastructure provider for the
                Cosmos ecosystem — nodes, relayers, explorers and faucets kept
                running around the clock.
              </p>
              <div className="sz-footer__social">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="sz-footer__socialLink"
                    aria-label={s.label}
                    {...(s.href.startsWith("mailto:")
                      ? {}
                      : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Networks */}
            <div>
              <p className="sz-footer__col-title">Networks</p>
              <ul className="sz-footer__links">
                {NETWORK_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <p className="sz-footer__col-title">Services</p>
              <ul className="sz-footer__links">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                      <span className="sz-footer__ext" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="sz-footer__col-title">Connect</p>
              <ul className="sz-footer__links">
                <li>
                  <a
                    href="https://x.com/shazoes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X / Twitter
                    <span className="sz-footer__ext" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/shazoes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram
                    <span className="sz-footer__ext" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@shazoes.xyz">hello@shazoes.xyz</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="sz-footer__bottom">
            <p className="sz-footer__copy">
              &copy; {new Date().getFullYear()} Shazoes · All rights reserved.
            </p>
            <span className="sz-footer__note">
              <span className="sz-footer__dot" aria-hidden="true" />
              Infrastructure operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
