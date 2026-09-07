import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  FiCheck,
  FiCopy,
  FiDatabase,
  FiKey,
  FiPlus,
  FiRefreshCw,
  FiServer,
  FiShield,
  FiTrash2,
  FiExternalLink,
  FiCode,
} from 'react-icons/fi';
import {
  useCreateErpApiKeyMutation,
  useGetErpApiKeysQuery,
  useRevokeErpApiKeyMutation,
} from '@/features/supplier/inventory/inventoryApi';
import { getApiErrorMessage } from '@/features/supplier/apiError';
import { env } from '@/config/env';

function CodeSnippet({ code, language = 'bash', label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0f172a] text-slate-100 shadow-md">
      <div className="flex items-center justify-between border-b border-gray-800 bg-[#1e293b]/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label || language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700 active:scale-95"
          title="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="size-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
        <pre>{code}</pre>
      </div>
    </div>
  );
}

export default function ErpIntegrationSection() {
  const { t } = useTranslation();
  const [keyName, setKeyName] = useState('');
  const [activeDocTab, setActiveDocTab] = useState('create');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);

  const {
    data: apiKeysData,
    isLoading: isKeysLoading,
    isError: isKeysError,
    error: keysError,
  } = useGetErpApiKeysQuery();

  const [createApiKey, { isLoading: isCreatingKey }] =
    useCreateErpApiKeyMutation();
  const [revokeApiKey, { isLoading: isRevokingKey }] =
    useRevokeErpApiKeyMutation();

  const apiKeys = useMemo(() => {
    if (Array.isArray(apiKeysData)) return apiKeysData;
    if (Array.isArray(apiKeysData?.keys)) return apiKeysData.keys;
    if (Array.isArray(apiKeysData?.apiKeys)) return apiKeysData.apiKeys;
    if (Array.isArray(apiKeysData?.data)) return apiKeysData.data;
    return [];
  }, [apiKeysData]);

  const apiBaseUrl = env.apiUrl || window.location.origin;

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    const name = keyName.trim() || 'Default ERP Sync';

    try {
      const res = await createApiKey({ name }).unwrap();
      const generatedToken =
        res?.apiKey || res?.key || res?.token || res?.data?.key || res?.data?.apiKey;

      if (generatedToken) {
        setNewlyCreatedKey(generatedToken);
      }
      setKeyName('');
      toast.success(
        t('panel.supplierInventory.erpKeyCreated', {
          defaultValue: 'API Key generated successfully!',
        }),
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          t('panel.supplierInventory.erpKeyCreateFailed', {
            defaultValue: 'Failed to generate API Key. Please try again.',
          }),
        ),
      );
    }
  };

  const handleRevoke = async (id) => {
    if (
      !window.confirm(
        t('panel.supplierInventory.confirmRevokeKey', {
          defaultValue:
            'Are you sure you want to revoke this API Key? Any external ERP sync using this key will immediately stop working.',
        }),
      )
    ) {
      return;
    }

    try {
      await revokeApiKey(id).unwrap();
      toast.success(
        t('panel.supplierInventory.erpKeyRevoked', {
          defaultValue: 'API key revoked successfully.',
        }),
      );
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          t('panel.supplierInventory.erpKeyRevokeFailed', {
            defaultValue: 'Failed to revoke API key.',
          }),
        ),
      );
    }
  };

  const sampleApiKey =
    newlyCreatedKey ||
    apiKeys[0]?.key ||
    apiKeys[0]?.apiKey ||
    'sk_live_erp_9a8b7c6d5e4f3a2b1c0d';

  // API Examples
  const curlCreateProduct = `curl -X POST "${apiBaseUrl}/api/supplier/erp/inventory" \\
  -H "Content-Type: application/json" \\
  -H "x-erp-api-key: ${sampleApiKey}" \\
  -d '{
    "name": "Portland Cement 50kg Bag",
    "sku": "CEM-PORT-50KG",
    "quantity": 250,
    "price": 12.50,
    "categoryId": "cat_construction_materials",
    "warehouseLocation": "Lisbon Central Warehouse, Bay 4",
    "factoryName": "Cimentos de Portugal"
  }'`;

  const curlRestock = `curl -X PATCH "${apiBaseUrl}/api/supplier/erp/inventory/PRODUCT_ID_OR_SKU/restock" \\
  -H "Content-Type: application/json" \\
  -H "x-erp-api-key: ${sampleApiKey}" \\
  -d '{
    "quantity": 100
  }'`;

  const curlFetchList = `curl -X GET "${apiBaseUrl}/api/supplier/erp/inventory?page=1&limit=20" \\
  -H "x-erp-api-key: ${sampleApiKey}"`;

  const curlDelete = `curl -X DELETE "${apiBaseUrl}/api/supplier/erp/inventory/PRODUCT_ID" \\
  -H "x-erp-api-key: ${sampleApiKey}"`;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--active)] text-white shadow-md">
              <FiServer className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.erpIntegrationTitle', {
                  defaultValue: 'Enterprise Resource Planning (ERP) Integration',
                })}
              </h2>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {t('panel.supplierInventory.erpIntegrationSubtitle', {
                  defaultValue:
                    'Connect SAP, Odoo, Oracle, Microsoft Dynamics, or your custom inventory software directly to this marketplace using REST API keys.',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="size-2 animate-ping rounded-full bg-emerald-500" />
              REST API Ready
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: API Key Management */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
              1
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.apiKeysTitle', {
                  defaultValue: 'API Keys & Authentication',
                })}
              </h3>
              <p className="text-xs text-[var(--secondary-text)]">
                {t('panel.supplierInventory.apiKeysSubtitle', {
                  defaultValue:
                    'Generate private API keys to authenticate your ERP requests. Include this key in the x-erp-api-key HTTP header.',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Generate Key Form */}
        <form
          onSubmit={handleGenerateKey}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <FiKey className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]" />
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder={t('panel.supplierInventory.keyNamePlaceholder', {
                defaultValue: 'Key Name (e.g. SAP Production, Odoo Sync)',
              })}
              className="h-11 w-full rounded-xl border border-gray-200 bg-[#FFFBF5] pr-4 pl-9 text-sm text-[var(--primary-text)] outline-none transition placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]"
            />
          </div>
          <button
            type="submit"
            disabled={isCreatingKey}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--active)] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingKey ? (
              <FiRefreshCw className="size-4 animate-spin" />
            ) : (
              <FiPlus className="size-4" />
            )}
            <span>
              {t('panel.supplierInventory.generateKeyBtn', {
                defaultValue: 'Generate New API Key',
              })}
            </span>
          </button>
        </form>

        {/* Newly created key highlight modal-like box */}
        {newlyCreatedKey && (
          <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FiShield className="size-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    New API Key Generated - Save It Securely
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  Please copy this key now. For your security, this key may not be fully displayed again.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-mono text-xs font-bold text-emerald-800 select-all">
                    {newlyCreatedKey}
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(newlyCreatedKey);
                      toast.success('Key copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <FiCopy className="size-3.5" />
                    Copy
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewlyCreatedKey(null)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Active Keys Table */}
        <div className="mt-6">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--secondary-text)]">
            Active API Keys ({apiKeys.length})
          </h4>

          {isKeysLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
            </div>
          ) : isKeysError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              {getApiErrorMessage(
                keysError,
                'Could not load API keys. If this is the first time, generate a new key above.',
              )}
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-8 text-center">
              <FiKey className="size-8 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-[var(--primary-text)]">
                No API keys generated yet
              </p>
              <p className="mt-1 text-xs text-[var(--secondary-text)] max-w-sm">
                Generate an API key above to start syncing products and stock from your ERP application.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-[var(--secondary-text)] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Name / Label</th>
                    <th className="px-4 py-3">API Key Prefix</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {apiKeys.map((keyItem) => {
                    const keyString =
                      keyItem.key || keyItem.apiKey || keyItem.token || '';
                    const maskedKey =
                      keyString.length > 12
                        ? `${keyString.slice(0, 8)}••••••••${keyString.slice(-4)}`
                        : keyString || 'sk_live_••••••••';

                    return (
                      <tr key={keyItem.id || keyItem._id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3.5 font-semibold text-[var(--primary-text)]">
                          {keyItem.name || keyItem.label || 'ERP Key'}
                        </td>
                        <td className="px-4 py-3.5">
                          <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-700">
                            {maskedKey}
                          </code>
                        </td>
                        <td className="px-4 py-3.5 text-[var(--secondary-text)]">
                          {keyItem.createdAt
                            ? new Date(keyItem.createdAt).toLocaleDateString()
                            : 'Active'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRevoke(keyItem.id || keyItem._id)}
                            disabled={isRevokingKey}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                            title="Revoke Key"
                          >
                            <FiTrash2 className="size-3.5" />
                            Revoke
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: REST API Documentation & Code Examples */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
            2
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--primary-text)]">
              API Documentation: Adding & Maintaining Products
            </h3>
            <p className="text-xs text-[var(--secondary-text)]">
              Follow these simple REST endpoints to automate product creation, stock updates, and catalog queries.
            </p>
          </div>
        </div>

        {/* Documentation Tab Nav */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 'create', label: '1. Add / Create Product (POST)', icon: FiPlus },
            { id: 'restock', label: '2. Restock / Update Stock (PATCH)', icon: FiRefreshCw },
            { id: 'list', label: '3. List Inventory (GET)', icon: FiDatabase },
            { id: 'delete', label: '4. Delete / Remove (DELETE)', icon: FiTrash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDocTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDocTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  isActive
                    ? 'bg-[var(--active)] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Doc Content Area */}
        <div className="mt-6 space-y-6">
          {activeDocTab === 'create' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  POST
                </span>
                <code className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-800">
                  {apiBaseUrl}/api/supplier/erp/inventory
                </code>
              </div>

              <p className="text-sm text-[var(--secondary-text)]">
                Adds a new product to your inventory catalog. Once added via ERP, it will immediately appear in your marketplace inventory list and stock balance.
              </p>

              {/* Request Parameters Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50 text-[var(--secondary-text)] font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Field</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Required</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[var(--primary-text)]">
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">name</td>
                      <td className="px-4 py-2 font-mono text-gray-500">String</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">Full commercial name or title of the product.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">sku</td>
                      <td className="px-4 py-2 font-mono text-gray-500">String</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">Unique Stock Keeping Unit (SKU) identifier.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">quantity</td>
                      <td className="px-4 py-2 font-mono text-gray-500">Number</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">Initial quantity available in stock.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">price</td>
                      <td className="px-4 py-2 font-mono text-gray-500">Number</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">Unit sale price in Euros (€).</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">warehouseLocation</td>
                      <td className="px-4 py-2 font-mono text-gray-500">String</td>
                      <td className="px-4 py-2 text-gray-500">Optional</td>
                      <td className="px-4 py-2">Warehouse name or physical address location.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">factoryName</td>
                      <td className="px-4 py-2 font-mono text-gray-500">String</td>
                      <td className="px-4 py-2 text-gray-500">Optional</td>
                      <td className="px-4 py-2">Manufacturing plant or supplier branch name.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Code Examples */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <FiCode className="size-4 text-[var(--active)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-text)]">
                    cURL Command
                  </span>
                </div>
                <CodeSnippet code={curlCreateProduct} language="bash" label="cURL Command" />
              </div>
            </div>
          )}

          {activeDocTab === 'restock' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  PATCH
                </span>
                <code className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-800">
                  {apiBaseUrl}/api/supplier/erp/inventory/:id/restock
                </code>
              </div>

              <p className="text-sm text-[var(--secondary-text)]">
                Increment or adjust stock levels in real-time when new shipments arrive or stock is reconciled in your ERP.
              </p>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50 text-[var(--secondary-text)] font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Parameter</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Required</th>
                      <th className="px-4 py-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[var(--primary-text)]">
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">:id</td>
                      <td className="px-4 py-2 font-mono text-gray-500">Path / String</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">The product ID or SKU in the system.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-semibold text-amber-700">quantity</td>
                      <td className="px-4 py-2 font-mono text-gray-500">Number</td>
                      <td className="px-4 py-2 font-bold text-emerald-600">Yes</td>
                      <td className="px-4 py-2">Quantity to add to the existing stock balance.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeSnippet code={curlRestock} language="bash" label="cURL Restock" />
            </div>
          )}

          {activeDocTab === 'list' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  GET
                </span>
                <code className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-800">
                  {apiBaseUrl}/api/supplier/erp/inventory?page=1&limit=20
                </code>
              </div>

              <p className="text-sm text-[var(--secondary-text)]">
                Query current stock levels, active SKUs, and pricing recorded in the marketplace for cross-checking with your ERP system.
              </p>

              <CodeSnippet code={curlFetchList} language="bash" label="cURL Fetch Inventory List" />
            </div>
          )}

          {activeDocTab === 'delete' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-red-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                  DELETE
                </span>
                <code className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-800">
                  {apiBaseUrl}/api/supplier/erp/inventory/:id
                </code>
              </div>

              <p className="text-sm text-[var(--secondary-text)]">
                Remove a discontinued product from your marketplace inventory catalog via ERP.
              </p>

              <CodeSnippet code={curlDelete} language="bash" label="cURL Delete Product" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
