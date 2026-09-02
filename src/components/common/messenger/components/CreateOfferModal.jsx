import { useEffect, useId, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  FiCalendar,
  FiChevronDown,
  FiDollarSign,
  FiMapPin,
  FiPackage,
  FiX,
} from 'react-icons/fi';
import { useGetSupplierProductsQuery } from '@/features/supplier/products/productApi';
import { useGetBuyerProjectsForQuoteQuery } from '@/features/supplier/quotes/quotesApi';

const UNLOADING_TYPES = [
  'Crane (12m)',
  'Crane (24m)',
  'Tipper Truck',
  'Forklift',
  'Manual Unloading',
];
const ACCESS_CONDITIONS = [
  'Easy Access',
  'Narrow Road',
  'Restricted Area',
  'Difficult Terrain',
  'Manual Unloading',
];

const INPUT_BG = 'bg-[#FFF8F0]';

const emptyForm = () => ({
  warehouse: '',
  productId: '',
  productName: '',
  totalQuantity: '',
  projectName: '',
  deliveryLocation: '',
  unloadingType: '',
  accessConditions: '',
  totalPrice: '',
  installmentMonths: '',
  installments: [],
});

export default function CreateOfferModal({ open, activeChat, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  const quoteId = activeChat?.raw?.quoteRequestId || activeChat?.id;

  const { data: productsData } = useGetSupplierProductsQuery({ limit: 1000 }, { skip: !open });
  const { data: projectsData } = useGetBuyerProjectsForQuoteQuery(quoteId, { skip: !open || !quoteId });

  const productOptions = useMemo(() => {
    return productsData?.products?.map((p) => p.product?.title).filter(Boolean) || [];
  }, [productsData]);

  const warehouseOptions = useMemo(() => {
    const locs = productsData?.products?.map((p) => p.warehouseLocation).filter(Boolean) || [];
    return [...new Set(locs)];
  }, [productsData]);

  const projectOptions = useMemo(() => {
    return projectsData?.map((p) => p.projectName) || [];
  }, [projectsData]);

  const deliveryLocationOptions = useMemo(() => {
    const locs = projectsData?.map((p) => p.location).filter(Boolean) || [];
    return [...new Set(locs)];
  }, [projectsData]);

  useEffect(() => {
    if (!open) return undefined;
    setForm(emptyForm());
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  // Auto-calculate Total Price
  useEffect(() => {
    if (!open) return;
    const qty = parseFloat(form.totalQuantity) || 0;
    const foundProduct = productsData?.products?.find((p) => p.product?.title === form.productName);
    const unitPrice = foundProduct?.raw?.basePrice || foundProduct?.raw?.price || 0;
    
    // Only auto-update if we have a valid quantity and unit price
    if (qty > 0 && unitPrice > 0) {
      const calculatedPrice = (qty * unitPrice).toFixed(2);
      setForm((prev) => {
        // Prevent infinite loops by only updating if changed
        if (prev.totalPrice === calculatedPrice) return prev;
        return { ...prev, totalPrice: calculatedPrice };
      });
    }
  }, [form.productName, form.totalQuantity, productsData, open]);

  // Auto-calculate Installments
  useEffect(() => {
    if (!open) return;
    const months = parseInt(form.installmentMonths, 10);
    if (months > 0) {
      const price = parseFloat(form.totalPrice) || 0;
      const qty = parseFloat(form.totalQuantity) || 0;
      
      const pricePerInst = (price / months).toFixed(2);
      const qtyPerInst = (qty / months).toFixed(2);
      
      setForm((prev) => {
        // Only update if the length changed to avoid overwriting manual edits immediately
        if (prev.installments.length === months) return prev;
        
        const newInstallments = Array.from({ length: months }).map(() => ({
          price: pricePerInst,
          quantity: qtyPerInst,
        }));
        return { ...prev, installments: newInstallments };
      });
    } else {
      setForm((prev) => {
        if (prev.installments.length === 0) return prev;
        return { ...prev, installments: [] };
      });
    }
  }, [form.installmentMonths, form.totalPrice, form.totalQuantity, open]);

  if (!open) return null;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setInstallment = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      installments: prev.installments.map((row, i) =>
        i === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const addInstallment = () => {
    setForm((prev) => ({
      ...prev,
      installments: [...prev.installments, { price: '', quantity: '' }],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Find productId if they typed a known product name
    const foundProduct = productsData?.products?.find((p) => p.product?.title === form.productName);
    
    // Clean up installments array (remove empty rows)
    const validInstallments = form.installments.filter(
      (inst) => inst.price !== '' && inst.quantity !== ''
    );

    const submitForm = {
      ...form,
      productId: foundProduct ? foundProduct.id : undefined,
      installments: validInstallments.length > 0 ? validInstallments : undefined,
      installmentMonths: form.installmentMonths ? form.installmentMonths : undefined,
    };
    
    onSubmit?.(submitForm);
    onClose?.();
  };

  return createPortal(
    <div className='fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4'>
      <button
        type='button'
        aria-label='Close overlay'
        className='absolute inset-0 bg-black/45'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='create-offer-title'
        className='relative z-10 flex max-h-[min(85vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
      >
        {/* Header */}
        <div className='flex items-start gap-3 border-b border-gray-200 px-5 py-4'>
          <span className='inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
            <FiPackage className='size-4' />
          </span>
          <div className='min-w-0 flex-1'>
            <h2
              id='create-offer-title'
              className='text-base font-bold text-[var(--primary-text)]'
            >
              Offer Card
            </h2>
            <p className='text-xs text-[var(--secondary-text)]'>
              Create an offer card to send to the customer.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100'
          >
            <FiX className='size-5' />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 space-y-3 overflow-y-auto px-5 py-4'>
            <ComboboxField
              label='Warehouse location'
              icon={<FiPackage className='size-3.5' />}
              value={form.warehouse}
              placeholder='Select or type warehouse'
              options={warehouseOptions}
              onChange={(value) => setField('warehouse', value)}
            />
            <ComboboxField
              label='Product'
              icon={<FiPackage className='size-3.5' />}
              value={form.productName}
              placeholder='Select or type Product Name'
              options={productOptions}
              onChange={(value) => setField('productName', value)}
            />
            <TextField
              label='Total Quantity'
              value={form.totalQuantity}
              placeholder='.bags'
              onChange={(value) => setField('totalQuantity', value)}
            />
            <ComboboxField
              label='Project Name'
              value={form.projectName}
              placeholder='Select or type Project Name'
              options={projectOptions}
              onChange={(value) => setField('projectName', value)}
            />
            <ComboboxField
              label='Delivery Location'
              icon={<FiMapPin className='size-3.5' />}
              value={form.deliveryLocation}
              placeholder='Select or type delivery location'
              options={deliveryLocationOptions}
              onChange={(value) => setField('deliveryLocation', value)}
            />
            <SelectField
              label='Types of unloading Needed'
              value={form.unloadingType}
              placeholder='Add Type'
              options={UNLOADING_TYPES}
              onChange={(value) => setField('unloadingType', value)}
            />
            <SelectField
              label='Access Conditions'
              value={form.accessConditions}
              placeholder='Add Unloading System'
              options={ACCESS_CONDITIONS}
              onChange={(value) => setField('accessConditions', value)}
            />

            <div className='grid grid-cols-2 gap-3 pt-1'>
              <TextField
                label='Total Price'
                icon={<span className='text-[15px] font-medium leading-none'>€</span>}
                value={form.totalPrice}
                placeholder='€'
                onChange={(value) => setField('totalPrice', value)}
              />
              <TextField
                label='Installment'
                icon={<FiCalendar className='size-3.5' />}
                value={form.installmentMonths}
                placeholder='months'
                onChange={(value) => setField('installmentMonths', value)}
              />

              {form.installments.map((row, index) => (
                <div key={`inst-${index}`} className='contents'>
                  <TextField
                    label={`${ordinal(index + 1)} Installment`}
                    value={row.price}
                    placeholder='Price'
                    onChange={(value) => setInstallment(index, 'price', value)}
                  />
                  <TextField
                    label='Product Quantity'
                    value={row.quantity}
                    placeholder='quantity'
                    onChange={(value) =>
                      setInstallment(index, 'quantity', value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              type='button'
              onClick={addInstallment}
              className='text-sm font-semibold text-[var(--active)] hover:underline'
            >
              + Add New Installment
            </button>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[var(--secondary-text)] hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-md bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95'
            >
              Send Offer
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function TextField({ label, value, onChange, placeholder, icon }) {
  return (
    <label className='block'>
      <span className='mb-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]'>
        {icon ? (
          <span className='text-[var(--secondary-text)]'>{icon}</span>
        ) : null}
        {label}
      </span>
      <input
        type='text'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-0 block w-full rounded-md border-0 px-3 py-2.5 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--active)]/30 ${INPUT_BG}`}
      />
    </label>
  );
}

function ComboboxField({ label, value, onChange, placeholder, options, icon }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));

  return (
    <div ref={rootRef} className='relative block'>
      <span className='mb-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]'>
        {icon ? (
          <span className='text-[var(--secondary-text)]'>{icon}</span>
        ) : null}
        {label}
      </span>
      <div className={`relative flex items-center rounded-md focus-within:ring-2 focus-within:ring-[var(--active)]/30 ${INPUT_BG}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 px-3 py-2.5 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]`}
        />
        <button
           type="button"
           onClick={() => setOpen(!open)}
           className="px-3 text-[var(--secondary-text)]"
        >
          <FiChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && filtered.length > 0 ? (
        <ul
          id={listId}
          role='listbox'
          className='absolute right-0 left-0 z-20 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg'
        >
          {filtered.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role='option' aria-selected={selected}>
                <button
                  type='button'
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2.5 text-left text-sm ${
                    selected
                      ? 'bg-[var(--active)] font-medium text-white'
                      : 'border-b border-gray-100 text-[var(--primary-text)] last:border-b-0 hover:bg-[color-mix(in_srgb,var(--active)_10%,white)]'
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function SelectField({ label, value, onChange, placeholder, options, icon }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <div ref={rootRef} className='relative block'>
      <span className='mb-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]'>
        {icon ? (
          <span className='text-[var(--secondary-text)]'>{icon}</span>
        ) : null}
        {label}
      </span>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`mt-0 flex w-full items-center justify-between rounded-md border-0 px-3 py-2.5 text-left text-sm outline-none focus:ring-2 focus:ring-[var(--active)]/30 ${INPUT_BG} ${
          value ? 'text-[var(--primary-text)]' : 'text-[var(--secondary-text)]'
        }`}
      >
        <span className='truncate'>{value || placeholder}</span>
        <FiChevronDown
          className={`size-4 shrink-0 text-[var(--secondary-text)] transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role='listbox'
          className='absolute right-0 left-0 z-20 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg'
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option} role='option' aria-selected={selected}>
                <button
                  type='button'
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2.5 text-left text-sm ${
                    selected
                      ? 'bg-[var(--active)] font-medium text-white'
                      : 'border-b border-gray-100 text-[var(--primary-text)] last:border-b-0 hover:bg-[color-mix(in_srgb,var(--active)_10%,white)]'
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
}
