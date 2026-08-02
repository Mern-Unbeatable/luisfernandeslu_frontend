import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

const footerColumnDefs = [
  {
    titleKey: 'footer.businessman',
    links: [
      { labelKey: 'footer.supplier', href: '#' },
      { labelKey: 'footer.transporter', href: '#' },
      { labelKey: 'footer.affiliates', href: '#' },
    ],
  },
  {
    titleKey: 'footer.support',
    links: [
      { labelKey: 'footer.helpCenter', href: '#' },
      { labelKey: 'footer.dispute', href: '#' },
      { labelKey: 'footer.returns', href: '#' },
      { labelKey: 'footer.complaintBook', href: '#' },
    ],
  },
  {
    titleKey: 'footer.legal',
    links: [
      { labelKey: 'footer.terms', href: '#' },
      { labelKey: 'footer.privacy', href: '#' },
      { labelKey: 'footer.returnPolicy', href: '#' },
    ],
  },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="w-full mt-auto bg-[#FDFBF7]">
      <div className="mx-auto w-full container px-4 py-12 sm:px-6 md:py-12 lg:px-10 xl:px-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12 lg:items-start">
          <div className="flex flex-col items-start gap-5 md:gap-6 lg:h-full">
            <Logo />
            <p className="max-w-sm text-base leading-relaxed text-neutral-800 md:text-lg">
              {t('footer.description')}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-neutral-900 md:text-base">
                {t('footer.follow')}
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
              {t('footer.copyright')}
            </p>
          </div>

          {footerColumnDefs.map((column) => (
            <FooterColumn key={column.titleKey} {...column} />
          ))}
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ titleKey, links }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-start gap-3 md:gap-4">
      <h3 className="text-base font-semibold text-neutral-900 md:text-lg">
        {t(titleKey)}
      </h3>
      <ul className="flex flex-col items-start gap-2.5 md:gap-3">
        {links.map((link) => (
          <li key={link.labelKey}>
            <Link
              to={link.href}
              className="text-sm text-neutral-800 transition-colors hover:text-amber-600 md:text-base"
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
