import Logo from '../../components/common/Logo/Logo'
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from 'react-icons/fi'

const socialLinks = [
  { Icon: FiFacebook, label: 'Facebook' },
  { Icon: FiInstagram, label: 'Instagram' },
  { Icon: FiLinkedin, label: 'LinkedIn' },
  { Icon: FiYoutube, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
        <div className="flex flex-col items-start gap-7">
          <div className="flex flex-col items-start gap-4">
            <Logo />
            <p className="max-w-sm text-stone-900 text-xl leading-snug">
              The most complete building materials marketplace in Portugal.
              Delivery within 2 hours.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-900 text-base">Follow :</span>
            <div className="flex items-center gap-3.5">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 hover:border-amber-500 hover:text-white hover:bg-amber-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <FooterColumn
          title="For Businessman"
          links={['Being a Supplier', 'Being a transporter', 'Affiliates']}
        />
        <FooterColumn
          title="Support"
          links={['Help Center', 'Dispute resolution', 'Returns', 'Complaint Book']}
        />
        <FooterColumn
          title="Legal"
          links={['General Terms & Condition', 'Privacy Policy', 'Return Policy']}
        />
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div className="inline-flex flex-col items-start gap-4">
      <div className="text-neutral-900 text-xl font-semibold">{title}</div>
      <div className="flex flex-col items-start gap-3">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="text-neutral-900 text-base normal-case hover:text-amber-600 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  )
}