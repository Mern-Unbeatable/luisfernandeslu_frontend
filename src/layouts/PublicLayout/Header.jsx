import Logo from '../../components/common/Logo/Logo'

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="max-w-[1920px] mx-auto px-24 py-5 inline-flex justify-between items-center gap-8">
        <Logo />

        <div className="flex-grow max-w-xl px-5 py-3.5 bg-white rounded-xs shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-start items-start gap-2">
          <div className="w-full justify-start text-slate-500 text-sm font-normal font-['Public_Sans'] leading-5">
            search product name......
          </div>
          <div className="size-5 relative">
            <div className="size-5 left-0 top-0 absolute" />
            <div className="size-3.5 left-[2.50px] top-[2.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
            <div className="size-1 left-[13.70px] top-[13.70px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-zinc-900" />
          </div>
        </div>

        <div className="flex justify-start items-center gap-9">
          <div className="h-11 p-2.5 rounded-sm outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-start items-center gap-2">
            <div className="size-5 relative overflow-hidden">
              <div className="size-4 left-[1.67px] top-[1.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-950" />
              <div className="w-1.5 h-4 left-[6.67px] top-[1.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-950" />
              <div className="w-4 h-0 left-[1.67px] top-[10px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-neutral-950" />
            </div>
            <div className="justify-start text-neutral-950 text-base font-medium font-['Inter']">English</div>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="size-8 relative overflow-hidden">
              <div className="w-7 h-6 left-[2.67px] top-[4px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
              <div className="w-3.5 h-0 left-[9.33px] top-[14.67px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
              <div className="w-2 h-0 left-[9.33px] top-[20px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
              <div className="w-2.5 h-0 left-[9.33px] top-[9.33px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
            </div>
            <div className="size-8 relative overflow-hidden">
              <div className="size-[2.67px] left-[9.33px] top-[26.67px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
              <div className="size-[2.67px] left-[24px] top-[26.67px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
              <div className="w-7 h-5 left-[2.73px] top-[2.73px] absolute outline outline-2 outline-offset-[-0.89px] outline-slate-800" />
            </div>
            <div className="size-8 relative overflow-hidden">
              <div className="w-8 h-3.5 left-0 top-[18.60px] absolute bg-white border-2 border-slate-800" />
              <div className="size-4 left-[7.68px] top-0 absolute bg-white border-2 border-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}