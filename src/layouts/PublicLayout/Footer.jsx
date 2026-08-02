import Logo from '../../components/common/Logo/Logo'

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      <div className="max-w-[1920px] mx-auto px-24 py-16 inline-flex justify-between items-start gap-20">
        <div className="flex flex-col justify-start items-start gap-7 max-w-md flex-1">
          <div className="flex flex-col justify-start items-start gap-4">
            <Logo />
            <div className="self-stretch justify-center text-stone-900 text-xl font-normal font-['Poppins']">
              The most complete building materials marketplace in Portugal. Delivery within 2 hours.
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="justify-start text-neutral-900 text-base font-normal font-['DM_Sans']">Follow : </div>
              <div className="flex justify-start items-center gap-3.5">
                <div className="relative">
                  <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                    <div className="size-6 relative overflow-hidden">
                      <div className="w-2.5 h-5 left-[7px] top-[2px] absolute bg-amber-500" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                    <div className="size-6 relative overflow-hidden">
                      <div className="w-5 h-4 left-[1.54px] top-[4px] absolute bg-amber-500" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                    <div className="size-6 relative overflow-hidden">
                      <div className="w-3.5 h-5 left-[4.52px] top-[2px] absolute bg-amber-500" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="size-10 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                    <div className="size-6 relative overflow-hidden">
                      <div className="w-5 h-4 left-[2px] top-[3px] absolute bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
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
    <div className="w-52 inline-flex flex-col justify-start items-start gap-4">
      <div className="justify-start text-neutral-900 text-xl font-semibold font-['DM_Sans']">{title}</div>
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        {links.map((link) => (
          <div
            key={link}
            className="self-stretch justify-start text-neutral-900 text-base font-normal font-['DM_Sans']"
          >
            {link}
          </div>
        ))}
      </div>
    </div>
  )
}