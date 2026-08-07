import Skeleton from '../../Skeleton/Skeleton'
import { FiEdit2 } from 'react-icons/fi'
import UserAvatar from './UserAvatar'

export default function Sidebar({
  chats = [],
  activeChatId,
  onSelectChat,
  isLoading = false,
  title = 'Recent Messages',
  showEditButton = false,
  onEditClick,
}) {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-[#F5F5F5]">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-5">
        <h2 className="text-base font-bold text-[var(--primary-text)]">
          {title}
        </h2>
        {showEditButton ? (
          <button
            type="button"
            onClick={onEditClick}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-white/70 hover:text-[var(--primary-text)]"
            aria-label="Edit conversations"
          >
            <FiEdit2 className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        ) : null}
      </div>

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
                        ? 'bg-[#ECECEC]'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar partner={chat.partner} />
                      {chat.online ? (
                        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#F5F5F5] bg-emerald-500" />
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
