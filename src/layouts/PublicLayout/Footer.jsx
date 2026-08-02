import { Link } from 'react-router-dom'
import Logo from '../../components/common/Logo/Logo'
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
} from 'react-icons/fa'

const socialLinks = [
  { Icon: FaFacebookF, label: 'Facebook' },
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaPinterestP, label: 'Pinterest' },
  { Icon: FaLinkedinIn, label: 'LinkedIn' },
]

const footerColumns = [
  {
    title: 'For Businessman',
    links: [
      { label: 'Being a Supplier', href: '#' },
      { label: 'Being a transporter', href: '#' },
      { label: 'Affiliates', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Dispute resolution', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Complaint Book', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'General Terms & Condition', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Return Policy', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-[#FDFBF7]">
      <div className="mx-auto w-full container px-4 py-12 sm:px-6 md:py-12 lg:px-10 xl:px-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12 lg:items-start">
          {/* Brand column */}
          <div className="flex flex-col items-start gap-5 md:gap-6 lg:h-full">
            <Logo />
            <p className="max-w-sm text-base leading-relaxed text-neutral-800 md:text-lg">
              The most complete building materials marketplace in Portugal.
              Delivery within 2 hours.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-neutral-900 md:text-base">
                Follow :
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-amber-500 hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <p className="mt-auto pt-4 text-sm text-neutral-700">
              © 2025 Construpreço. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div className="flex flex-col items-start gap-3 md:gap-4">
      <h3 className="text-base font-semibold text-neutral-900 md:text-lg">
        {title}
      </h3>
      <ul className="flex flex-col items-start gap-2.5 md:gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="text-sm text-neutral-800 transition-colors hover:text-amber-600 md:text-base"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
