import { FiEdit3, FiSearch } from 'react-icons/fi'
import Skeleton from '../Skeleton/Skeleton'
import UserAvatar from './UserAvatar'

export default function Sidebar({
  chats = [],
  activeChatId,
  search = '',
  onSearchChange,
  onSelectChat,
  isLoading = false,
  title = 'Recent Messages',
  onCompose,
}) {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-[#EEEEEE]">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3.5">
        <h2 className="text-base font-bold text-[var(--primary-text)]">
          {title}
        </h2>
        {onCompose ? (
          <button
            type="button"
            onClick={onCompose}
            aria-label="Compose"
            className="rounded-md p-1.5 text-[var(--secondary-text)] hover:bg-white hover:text-[var(--active)]"
          >
            <FiEdit3 className="size-5" />
          </button>
        ) : null}
      </div>

      {onSearchChange ? (
        <div className="px-3 pt-3">
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--active)]">
            <FiSearch className="size-4 shrink-0 text-[var(--secondary-text)]" />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
            />
          </label>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isLoading ? (
          <SidebarSkeleton />
        ) : chats.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-[var(--secondary-text)]">
            No conversations found.
          </p>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => {
              const isActive = activeChatId === chat.id
              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChat?.(chat.id)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-[#FFFFFF] shadow-sm'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar partner={chat.partner} />
                      {chat.online ? (
                        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#EEEEEE] bg-emerald-500" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[var(--primary-text)]">
                          {chat.name}
                        </p>
                        <span className="shrink-0 text-[10px] text-[var(--secondary-text)]">
                          {chat.time}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="truncate text-xs text-[var(--secondary-text)]">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 ? (
                          <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--active)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {chat.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="space-y-3 px-2 py-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
