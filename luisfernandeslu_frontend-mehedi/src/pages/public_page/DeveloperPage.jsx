// import { useEffect, useMemo, useState } from 'react'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { FiChevronDown, FiCopy, FiCheck, FiSearch } from 'react-icons/fi'
// import Seo from '../../components/common/Seo/Seo'
// import {
//   COMPONENT_DOCS,
//   DOC_CATEGORIES,
//   filterComponentDocs,
//   getComponentDoc,
// } from '../../developer/catalog'
// import ComponentPreview from '../../developer/ComponentPreview'

// /** Escape regex special chars in a search query. */
// function escapeRegExp(value) {
//   return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// }

// /** Highlight all case-insensitive matches of `query` inside `text`. */
// function HighlightText({ text, query }) {
//   const value = text == null ? '' : String(text)
//   const q = query?.trim()
//   if (!q || !value) return value

//   const parts = value.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'))
//   if (parts.length === 1) return value

//   return parts.map((part, i) =>
//     part.toLowerCase() === q.toLowerCase() ? (
//       <mark
//         key={`${part}-${i}`}
//         className="rounded-sm bg-amber-200 px-0.5 text-inherit"
//       >
//         {part}
//       </mark>
//     ) : (
//       part
//     ),
//   )
// }

// function CodeBlock({ code, label }) {
//   const [copied, setCopied] = useState(false)

//   const copy = async () => {
//     try {
//       await navigator.clipboard.writeText(code)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1500)
//     } catch {
//       /* ignore */
//     }
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-slate-950">
//       <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
//         <span className="text-xs font-medium text-slate-300">{label}</span>
//         <button
//           type="button"
//           onClick={copy}
//           className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
//         >
//           {copied ? (
//             <FiCheck className="size-3.5" />
//           ) : (
//             <FiCopy className="size-3.5" />
//           )}
//           {copied ? 'Copied' : 'Copy'}
//         </button>
//       </div>
//       <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-100 sm:text-sm">
//         <code>{code}</code>
//       </pre>
//     </div>
//   )
// }

// function PropTable({ props = [], required, query = '' }) {
//   const rows = props.filter((p) => Boolean(p.required) === required)
//   if (!rows.length) {
//     return (
//       <p className="text-sm text-[var(--secondary-text)]">
//         {required ? 'No required props.' : 'No optional props.'}
//       </p>
//     )
//   }

//   return (
//     <div className="overflow-x-auto rounded-xl border border-gray-200">
//       <table className="min-w-full border-collapse text-left text-sm">
//         <thead>
//           <tr className="border-b border-gray-200 bg-gray-50">
//             <th className="px-3 py-2.5 font-semibold">Prop</th>
//             <th className="px-3 py-2.5 font-semibold">Type</th>
//             {!required ? (
//               <th className="px-3 py-2.5 font-semibold">Default</th>
//             ) : null}
//             <th className="px-3 py-2.5 font-semibold">Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((prop) => (
//             <tr key={prop.name} className="border-b border-gray-100 last:border-0">
//               <td className="px-3 py-2.5 font-mono text-xs text-[var(--active)] sm:text-sm">
//                 <HighlightText text={prop.name} query={query} />
//               </td>
//               <td className="px-3 py-2.5 font-mono text-xs text-[var(--primary-text)]">
//                 <HighlightText text={prop.type} query={query} />
//               </td>
//               {!required ? (
//                 <td className="px-3 py-2.5 font-mono text-xs text-[var(--secondary-text)]">
//                   <HighlightText text={prop.defaultValue ?? '—'} query={query} />
//                 </td>
//               ) : null}
//               <td className="px-3 py-2.5 text-[var(--secondary-text)]">
//                 <HighlightText text={prop.description} query={query} />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// function CallbackTable({ props = [], query = '' }) {
//   const rows = props.filter((p) => p.name.startsWith('on'))
//   if (!rows.length) return null

//   return (
//     <section className="space-y-3">
//       <div>
//         <h2 className="text-lg font-bold text-[var(--primary-text)]">
//           Callbacks (prop drill)
//         </h2>
//         <p className="mt-1 text-sm text-[var(--secondary-text)]">
//           UI only fires these handlers — pass them from the parent page. Example:{' '}
//           <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
//             onBack={'{() => navigate(-1)}'}
//           </code>
//         </p>
//       </div>
//       <div className="overflow-x-auto rounded-xl border border-gray-200">
//         <table className="min-w-full border-collapse text-left text-sm">
//           <thead>
//             <tr className="border-b border-gray-200 bg-amber-50/80">
//               <th className="px-3 py-2.5 font-semibold">Callback</th>
//               <th className="px-3 py-2.5 font-semibold">Signature</th>
//               <th className="px-3 py-2.5 font-semibold">When it runs</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((prop) => (
//               <tr
//                 key={prop.name}
//                 className="border-b border-gray-100 last:border-0"
//               >
//                 <td className="px-3 py-2.5 font-mono text-xs text-[var(--active)] sm:text-sm">
//                   <HighlightText text={prop.name} query={query} />
//                 </td>
//                 <td className="px-3 py-2.5 font-mono text-xs text-[var(--primary-text)]">
//                   <HighlightText text={prop.type} query={query} />
//                 </td>
//                 <td className="px-3 py-2.5 text-[var(--secondary-text)]">
//                   <HighlightText text={prop.description} query={query} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   )
// }

// function DocPanel({ doc, query = '' }) {
//   if (!doc) {
//     return (
//       <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
//         <p className="text-sm text-[var(--secondary-text)]">
//           Select a component from the sidebar to view documentation.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <article className="space-y-8">
//       <header>
//         <p className="text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
//           <HighlightText text={doc.category} query={query} />
//         </p>
//         <h1 className="mt-1 text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
//           <HighlightText text={doc.name} query={query} />
//         </h1>
//         <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
//           <HighlightText text={doc.summary} query={query} />
//         </p>
//         <p className="mt-3 inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-xs text-[var(--primary-text)]">
//           <HighlightText text={doc.path} query={query} />
//         </p>
//       </header>

//       <section className="space-y-3">
//         <h2 className="text-lg font-bold text-[var(--primary-text)]">Import</h2>
//         <CodeBlock label="Import" code={doc.importExample} />
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-lg font-bold text-[var(--primary-text)]">
//           Required props
//         </h2>
//         <PropTable props={doc.props} required query={query} />
//         <h3 className="pt-2 text-sm font-semibold text-[var(--primary-text)]">
//           Required usage
//         </h3>
//         <CodeBlock label="JSX" code={doc.requiredExample} />
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-lg font-bold text-[var(--primary-text)]">
//           Optional props
//         </h2>
//         <PropTable props={doc.props} required={false} query={query} />
//         <h3 className="pt-2 text-sm font-semibold text-[var(--primary-text)]">
//           Optional usage
//         </h3>
//         <CodeBlock label="JSX" code={doc.optionalExample} />
//       </section>

//       <CallbackTable props={doc.props} query={query} />

//       {Array.isArray(doc.variants) && doc.variants.length > 0 ? (
//         <section className="space-y-6">
//           <div>
//             <h2 className="text-lg font-bold text-[var(--primary-text)]">
//               Variants
//             </h2>
//             <p className="mt-1 text-sm text-[var(--secondary-text)]">
//               Every major UI state for this component — code + live preview.
//             </p>
//           </div>
//           {doc.variants.map((variant) => (
//             <div
//               key={variant.id}
//               className="space-y-3 border-t border-gray-200 pt-6"
//             >
//               <div>
//                 <h3 className="text-base font-semibold text-[var(--primary-text)]">
//                   <HighlightText text={variant.name} query={query} />
//                 </h3>
//                 {variant.description ? (
//                   <p className="mt-1 text-sm text-[var(--secondary-text)]">
//                     <HighlightText text={variant.description} query={query} />
//                   </p>
//                 ) : null}
//               </div>
//               {variant.example ? (
//                 <CodeBlock label="JSX" code={variant.example} />
//               ) : null}
//               <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
//                 <ComponentPreview
//                   previewId={doc.previewId}
//                   variantId={variant.id}
//                 />
//               </div>
//             </div>
//           ))}
//         </section>
//       ) : (
//         <section className="space-y-3">
//           <h2 className="text-lg font-bold text-[var(--primary-text)]">
//             Output
//           </h2>
//           <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
//             <ComponentPreview previewId={doc.previewId} />
//           </div>
//         </section>
//       )}
//     </article>
//   )
// }

// /**
//  * /developer — component documentation for the team.
//  * Layout: search + category accordion sidebar + docs panel.
//  */
// export default function DeveloperPage() {
//   const { componentId } = useParams()
//   const navigate = useNavigate()
//   const [query, setQuery] = useState('')
//   const categoryIds = useMemo(
//     () => DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.id),
//     [],
//   )
//   const [openCategories, setOpenCategories] = useState(() => new Set(categoryIds))

//   // Search filters across all categories; sidebar always shows every category
//   const filtered = useMemo(
//     () => filterComponentDocs({ category: 'all', query }),
//     [query],
//   )

//   const selected = useMemo(() => {
//     const match = filtered.find((doc) => doc.id === componentId)
//     if (match) return match
//     if (componentId) {
//       const fromAll = getComponentDoc(componentId)
//       if (fromAll && !query.trim()) return fromAll
//     }
//     return filtered[0] || null
//   }, [filtered, componentId, query])

//   useEffect(() => {
//     if (!componentId && filtered[0]) {
//       navigate(`/developer/${filtered[0].id}`, { replace: true })
//     }
//   }, [componentId, filtered, navigate])

//   // Keep matching category menus open while searching
//   useEffect(() => {
//     if (!query.trim()) return
//     const next = new Set()
//     filtered.forEach((doc) => next.add(doc.category))
//     setOpenCategories(next)
//   }, [query, filtered])

//   // Ensure the selected component's category stays open
//   useEffect(() => {
//     if (!selected?.category) return
//     setOpenCategories((prev) => {
//       if (prev.has(selected.category)) return prev
//       const next = new Set(prev)
//       next.add(selected.category)
//       return next
//     })
//   }, [selected?.category])

//   const groups = useMemo(
//     () =>
//       DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
//         ...c,
//         items: filtered.filter((doc) => doc.category === c.id),
//       })),
//     [filtered],
//   )

//   const toggleCategory = (id) => {
//     setOpenCategories((prev) => {
//       const next = new Set(prev)
//       if (next.has(id)) next.delete(id)
//       else next.add(id)
//       return next
//     })
//   }

//   const expandAll = () => setOpenCategories(new Set(categoryIds))

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Seo title="Developer Docs" description="CONSTRUPRECO component documentation." />

//       <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
//         <div className="mx-auto flex max-w-[95%] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
//           <div>
//             <Link
//               to="/"
//               className="text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
//             >
//               ← Home
//             </Link>
//             <h1 className="mt-1 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
//               Developer Docs
//             </h1>
//             <p className="text-sm text-[var(--secondary-text)]">
//               {COMPONENT_DOCS.length} shared components — import, props, examples,
//               live output.
//             </p>
//           </div>
//           <label className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[var(--active)] focus-within:bg-white sm:w-80">
//             <FiSearch className="size-4 shrink-0 text-gray-400" aria-hidden />
//             <input
//               type="search"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search components, props, paths…"
//               className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
//             />
//           </label>
//         </div>
//       </div>

//       <div className="mx-auto grid max-w-[95%] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
//         <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
//           <div className="mb-3 flex items-center justify-between px-1">
//             <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
//               Category
//             </p>
//             <button
//               type="button"
//               onClick={expandAll}
//               className="text-[11px] font-medium text-[var(--active)] hover:underline"
//             >
//               Expand all
//             </button>
//           </div>

//           <nav className="flex flex-col gap-1">
//             <button
//               type="button"
//               onClick={expandAll}
//               className="rounded-lg px-3 py-2 text-left text-sm text-[var(--primary-text)] hover:bg-gray-50"
//             >
//               All
//             </button>

//             {groups.map((group) => {
//               const isOpen = openCategories.has(group.id)
//               return (
//                 <div key={group.id}>
//                   <button
//                     type="button"
//                     onClick={() => toggleCategory(group.id)}
//                     aria-expanded={isOpen}
//                     className={[
//                       'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
//                       isOpen
//                         ? 'bg-gray-50 font-semibold text-[var(--primary-text)]'
//                         : 'text-[var(--primary-text)] hover:bg-gray-50',
//                     ].join(' ')}
//                   >
//                     <span>
//                       <HighlightText text={group.label} query={query} />
//                       <span className="ml-1.5 text-xs font-normal text-gray-400">
//                         ({group.items.length})
//                       </span>
//                     </span>
//                     <FiChevronDown
//                       className={`size-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
//                       aria-hidden
//                     />
//                   </button>

//                   {isOpen ? (
//                     <ul className="mt-0.5 mb-1 ml-2 flex flex-col gap-0.5 border-l border-gray-200 pl-2">
//                       {group.items.length === 0 ? (
//                         <li className="px-3 py-1.5 text-xs text-[var(--secondary-text)]">
//                           No matches
//                         </li>
//                       ) : (
//                         group.items.map((doc) => (
//                           <li key={doc.id}>
//                             <button
//                               type="button"
//                               onClick={() => navigate(`/developer/${doc.id}`)}
//                               className={[
//                                 'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
//                                 selected?.id === doc.id
//                                   ? 'bg-amber-50 font-semibold text-amber-900'
//                                   : 'text-[var(--primary-text)] hover:bg-gray-50',
//                               ].join(' ')}
//                             >
//                               <HighlightText text={doc.name} query={query} />
//                             </button>
//                           </li>
//                         ))
//                       )}
//                     </ul>
//                   ) : null}
//                 </div>
//               )
//             })}
//           </nav>
//         </aside>

//         <main className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
//           <DocPanel doc={selected} query={query} />
//         </main>
//       </div>
//     </div>
//   )
// }


















import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiChevronDown, FiCopy, FiCheck, FiSearch, FiMenu, FiX } from 'react-icons/fi'
import Seo from '../../components/common/Seo/Seo'
import {
  COMPONENT_DOCS,
  DOC_CATEGORIES,
  filterComponentDocs,
  getComponentDoc,
} from '../../developer/catalog'
import ComponentPreview from '../../developer/ComponentPreview'

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function HighlightText({ text, query }) {
  const value = text == null ? '' : String(text)
  const q = query?.trim()
  if (!q || !value) return value

  const parts = value.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'))
  if (parts.length === 1) return value

  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark
        key={`${part}-${i}`}
        className="rounded-sm bg-amber-200 px-0.5 text-inherit"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <FiCheck className="size-3.5" />
          ) : (
            <FiCopy className="size-3.5" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-100 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function PropTable({ props = [], required, query = '' }) {
  const rows = props.filter((p) => Boolean(p.required) === required)
  if (!rows.length) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">
        {required ? 'No required props.' : 'No optional props.'}
      </p>
    )
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-2.5 font-semibold">Prop</th>
            <th className="px-3 py-2.5 font-semibold">Type</th>
            {!required ? (
              <th className="px-3 py-2.5 font-semibold">Default</th>
            ) : null}
            <th className="px-3 py-2.5 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((prop) => (
            <tr key={prop.name} className="border-b border-gray-100 last:border-0">
              <td className="px-3 py-2.5 font-mono text-xs text-[var(--active)] sm:text-sm">
                <HighlightText text={prop.name} query={query} />
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-[var(--primary-text)]">
                <HighlightText text={prop.type} query={query} />
              </td>
              {!required ? (
                <td className="px-3 py-2.5 font-mono text-xs text-[var(--secondary-text)]">
                  <HighlightText text={prop.defaultValue ?? '—'} query={query} />
                </td>
              ) : null}
              <td className="px-3 py-2.5 text-[var(--secondary-text)]">
                <HighlightText text={prop.description} query={query} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CallbackTable({ props = [], query = '' }) {
  const rows = props.filter((p) => p.name.startsWith('on'))
  if (!rows.length) return null

  return (
    <section className="min-w-0 space-y-3">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          Callbacks (prop drill)
        </h2>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          UI only fires these handlers — pass them from the parent page. Example:{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            onBack={'{() => navigate(-1)}'}
          </code>
        </p>
      </div>
      <div className="min-w-0 overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-amber-50/80">
              <th className="px-3 py-2.5 font-semibold">Callback</th>
              <th className="px-3 py-2.5 font-semibold">Signature</th>
              <th className="px-3 py-2.5 font-semibold">When it runs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((prop) => (
              <tr
                key={prop.name}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-3 py-2.5 font-mono text-xs text-[var(--active)] sm:text-sm">
                  <HighlightText text={prop.name} query={query} />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-[var(--primary-text)]">
                  <HighlightText text={prop.type} query={query} />
                </td>
                <td className="px-3 py-2.5 text-[var(--secondary-text)]">
                  <HighlightText text={prop.description} query={query} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function DocPanel({ doc, query = '' }) {
  if (!doc) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-[var(--secondary-text)]">
          Select a component from the sidebar to view documentation.
        </p>
      </div>
    )
  }

  return (
    <article className="min-w-0 space-y-8">
      <header className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
          <HighlightText text={doc.category} query={query} />
        </p>
        <h1 className="mt-1 break-words text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          <HighlightText text={doc.name} query={query} />
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
          <HighlightText text={doc.summary} query={query} />
        </p>
        <p className="mt-3 inline-flex max-w-full flex-wrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-xs break-all text-[var(--primary-text)]">
          <HighlightText text={doc.path} query={query} />
        </p>
      </header>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">Import</h2>
        <CodeBlock label="Import" code={doc.importExample} />
        {doc.importExample?.includes('@/data/demoData') ? (
          <p className="text-xs text-[var(--secondary-text)]">
            Demo payloads come from{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px]">
              src/data/demoData.js
            </code>
            . Prefer{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px]">
              @/data/demoData
            </code>{' '}
            — old per-component demo files were removed.
          </p>
        ) : null}
      </section>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          Required props
        </h2>
        <PropTable props={doc.props} required query={query} />
        <h3 className="pt-2 text-sm font-semibold text-[var(--primary-text)]">
          Required usage
        </h3>
        <CodeBlock label="JSX" code={doc.requiredExample} />
      </section>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          Optional props
        </h2>
        <PropTable props={doc.props} required={false} query={query} />
        <h3 className="pt-2 text-sm font-semibold text-[var(--primary-text)]">
          Optional usage
        </h3>
        <CodeBlock label="JSX" code={doc.optionalExample} />
      </section>

      <CallbackTable props={doc.props} query={query} />

      {Array.isArray(doc.variants) && doc.variants.length > 0 ? (
        <section className="min-w-0 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              Variants
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              Every major UI state for this component — code + live preview.
            </p>
          </div>
          {doc.variants.map((variant) => (
            <div
              key={variant.id}
              className="min-w-0 space-y-3 border-t border-gray-200 pt-6"
            >
              <div>
                <h3 className="text-base font-semibold text-[var(--primary-text)]">
                  <HighlightText text={variant.name} query={query} />
                </h3>
                {variant.description ? (
                  <p className="mt-1 text-sm text-[var(--secondary-text)]">
                    <HighlightText text={variant.description} query={query} />
                  </p>
                ) : null}
              </div>
              {variant.example ? (
                <CodeBlock label="JSX" code={variant.example} />
              ) : null}
              <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p sm:p-6">
                <ComponentPreview
                  previewId={doc.previewId}
                  variantId={variant.id}
                />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="min-w-0 space-y-3">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            Output
          </h2>
          <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <ComponentPreview previewId={doc.previewId} />
          </div>
        </section>
      )}
    </article>
  )
}

function CategoryNav({ groups, openCategories, toggleCategory, expandAll, selected, query, onSelect }) {
  return (
    <nav className="flex flex-col gap-1">
      <button
        type="button"
        onClick={expandAll}
        className="rounded-lg px-3 py-2 text-left text-sm text-[var(--primary-text)] hover:bg-gray-50"
      >
        All
      </button>

      {groups.map((group) => {
        const isOpen = openCategories.has(group.id)
        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleCategory(group.id)}
              aria-expanded={isOpen}
              className={[
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                isOpen
                  ? 'bg-gray-50 font-semibold text-[var(--primary-text)]'
                  : 'text-[var(--primary-text)] hover:bg-gray-50',
              ].join(' ')}
            >
              <span>
                <HighlightText text={group.label} query={query} />
                <span className="ml-1.5 text-xs font-normal text-gray-400">
                  ({group.items.length})
                </span>
              </span>
              <FiChevronDown
                className={`size-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isOpen ? (
              <ul className="mt-0.5 mb-1 ml-2 flex flex-col gap-0.5 border-l border-gray-200 pl-2">
                {group.items.length === 0 ? (
                  <li className="px-3 py-1.5 text-xs text-[var(--secondary-text)]">
                    No matches
                  </li>
                ) : (
                  group.items.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(doc.id)}
                        className={[
                          'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                          selected?.id === doc.id
                            ? 'bg-amber-50 font-semibold text-amber-900'
                            : 'text-[var(--primary-text)] hover:bg-gray-50',
                        ].join(' ')}
                      >
                        <HighlightText text={doc.name} query={query} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export default function DeveloperPage() {
  const { componentId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const categoryIds = useMemo(
    () => DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.id),
    [],
  )
  const [openCategories, setOpenCategories] = useState(() => new Set(categoryIds))

  const filtered = useMemo(
    () => filterComponentDocs({ category: 'all', query }),
    [query],
  )

  const selected = useMemo(() => {
    const match = filtered.find((doc) => doc.id === componentId)
    if (match) return match
    if (componentId) {
      const fromAll = getComponentDoc(componentId)
      if (fromAll && !query.trim()) return fromAll
    }
    return filtered[0] || null
  }, [filtered, componentId, query])

  useEffect(() => {
    if (!componentId && filtered[0]) {
      navigate(`/developer/${filtered[0].id}`, { replace: true })
    }
  }, [componentId, filtered, navigate])

  useEffect(() => {
    if (!query.trim()) return
    const next = new Set()
    filtered.forEach((doc) => next.add(doc.category))
    setOpenCategories(next)
  }, [query, filtered])

  useEffect(() => {
    if (!selected?.category) return
    setOpenCategories((prev) => {
      if (prev.has(selected.category)) return prev
      const next = new Set(prev)
      next.add(selected.category)
      return next
    })
  }, [selected?.category])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  const groups = useMemo(
    () =>
      DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
        ...c,
        items: filtered.filter((doc) => doc.category === c.id),
      })),
    [filtered],
  )

  const toggleCategory = (id) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => setOpenCategories(new Set(categoryIds))

  const selectComponent = (id) => {
    navigate(`/developer/${id}`)
    setMobileNavOpen(false)
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-gray-100">
      <Seo title="Developer Docs" description="CONSTRUPRECO component documentation." />

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[95%] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-start gap-2">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[var(--primary-text)] hover:bg-gray-50 lg:hidden"
              aria-label="Open category menu"
            >
              <FiMenu className="size-5" />
            </button>
            <div className="min-w-0">
              <Link
                to="/"
                className="text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
              >
                ← Home
              </Link>
              <h1 className="mt-1 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
                Developer Docs
              </h1>
              <p className="text-sm text-[var(--secondary-text)]">
                {COMPONENT_DOCS.length} shared components — import, props, examples,
                live output. Demo data:{' '}
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px]">
                  @/data/demoData
                </code>
              </p>
            </div>
          </div>
          <label className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[var(--active)] focus-within:bg-white sm:w-80">
            <FiSearch className="size-4 shrink-0 text-gray-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, props, paths…"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto grid max-w-[95%] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
        <aside className="hidden h-fit rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-36 lg:block lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto z-10">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
              Category
            </p>
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-medium text-[var(--active)] hover:underline"
            >
              Expand all
            </button>
          </div>
          <CategoryNav
            groups={groups}
            openCategories={openCategories}
            toggleCategory={toggleCategory}
            expandAll={expandAll}
            selected={selected}
            query={query}
            onSelect={selectComponent}
          />
        </aside>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                  Category
                </p>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-gray-50"
                  aria-label="Close category menu"
                >
                  <FiX className="size-5" />
                </button>
              </div>
              <CategoryNav
                groups={groups}
                openCategories={openCategories}
                toggleCategory={toggleCategory}
                expandAll={expandAll}
                selected={selected}
                query={query}
                onSelect={selectComponent}
              />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
          <DocPanel doc={selected} query={query} />
        </main>
      </div>
    </div>
  )
}