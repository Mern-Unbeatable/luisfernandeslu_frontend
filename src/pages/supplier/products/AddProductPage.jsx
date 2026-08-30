import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddProduct from "@/components/forms/AddProduct/AddProduct";
import { DEFAULT_ADD_PRODUCT } from "@/components/forms/AddProduct/defaults";
import Seo from "@/components/common/Seo/Seo";
import Skeleton from "@/components/common/Skeleton/Skeleton";
import {
  getApiErrorMessage,
  toSelectOptions,
} from "@/features/supplier/apiError";
import {
  useGetCategoriesQuery,
  useGetProductTypesQuery,
  useGetSubcategoriesQuery,
} from "@/features/supplier/inventory/inventoryApi";
import {
  useCreateSupplierProductMutation,
  useGenerateSupplierProductAiMutation,
  useGetSupplierProductByIdQuery,
  useLazyLookupSupplierProductBySkuQuery,
  useResubmitSupplierProductMutation,
  useUpdateSupplierProductMutation,
} from "@/features/supplier/products/productApi";
import {
  buildProductFormData,
  mapLookupToForm,
  mapProductToFormValue,
  resolveAiField,
} from "@/features/supplier/products/productMappers";
import { DEMO_WAREHOUSE_OPTIONS } from "@/data/demoData";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const isEdit = Boolean(productId);
  const isResubmit = searchParams.get("resubmit") === "1";

  const [form, setForm] = useState(DEFAULT_ADD_PRODUCT);
  const [hydratedId, setHydratedId] = useState(null);
  const [lastLookupSku, setLastLookupSku] = useState("");

  const {
    data: product,
    isLoading: productLoading,
    isError: productMissing,
  } = useGetSupplierProductByIdQuery(productId, { skip: !isEdit });

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: subCategories = [] } = useGetSubcategoriesQuery(
    form.categoryId,
    {
      skip: !form.categoryId,
    },
  );
  const { data: productTypes = [] } = useGetProductTypesQuery(
    form.subCategoryId,
    {
      skip: !form.subCategoryId,
    },
  );

  const [lookupSku] = useLazyLookupSupplierProductBySkuQuery();
  const [generateAi] = useGenerateSupplierProductAiMutation();
  const [createProduct, { isLoading: creating }] =
    useCreateSupplierProductMutation();
  const [updateProduct, { isLoading: updating }] =
    useUpdateSupplierProductMutation();
  const [resubmitProduct, { isLoading: resubmitting }] =
    useResubmitSupplierProductMutation();

  useEffect(() => {
    setHydratedId(null);
    setForm(DEFAULT_ADD_PRODUCT);
    setLastLookupSku("");
  }, [productId]);

  useEffect(() => {
    if (!isEdit || !product || hydratedId === product.id) return;
    setForm({
      ...DEFAULT_ADD_PRODUCT,
      ...mapProductToFormValue(product),
    });
    setHydratedId(product.id);
  }, [isEdit, product, hydratedId]);

  useEffect(() => {
    if (isEdit) return;
    const sku = String(form.sku || "").trim();
    if (sku.length < 3 || sku === lastLookupSku) return;

    const timer = window.setTimeout(async () => {
      try {
        const result = await lookupSku(sku).unwrap();
        const lookedUp = result?.product || result?.data || result;
        if (!lookedUp || lookedUp.success === false) {
          setLastLookupSku(sku);
          return;
        }
        setForm((current) => mapLookupToForm(lookedUp, current));
        setLastLookupSku(sku);
      } catch {
        setLastLookupSku(sku);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [form.sku, isEdit, lastLookupSku, lookupSku]);

  const warehouseOptions = useMemo(() => {
    const options = [
      {
        value: "",
        label: t("panel.supplierProducts.add.selectWarehouse"),
      },
      ...DEMO_WAREHOUSE_OPTIONS.filter((option) => option.value),
    ];

    if (
      form.warehouseLocation &&
      !options.some((option) => option.value === form.warehouseLocation)
    ) {
      options.push({
        value: form.warehouseLocation,
        label: form.warehouseLocation,
      });
    }

    return options;
  }, [form.warehouseLocation, t]);

  const categoryOptions = useMemo(
    () => [
      {
        value: "",
        label: t("panel.supplierProducts.add.selectCategory", {
          defaultValue: "Select category",
        }),
      },
      ...toSelectOptions(categories),
    ],
    [categories, t],
  );
  const subCategoryOptions = useMemo(
    () => [
      {
        value: "",
        label: t("panel.supplierProducts.add.selectSubCategory", {
          defaultValue: "Select subcategory",
        }),
      },
      ...toSelectOptions(subCategories),
    ],
    [subCategories, t],
  );
  const productTypeOptions = useMemo(
    () => [
      {
        value: "",
        label: t("panel.supplierProducts.add.selectProductType", {
          defaultValue: "Select product type",
        }),
      },
      ...toSelectOptions(productTypes),
    ],
    [productTypes, t],
  );

  if (isEdit && !productLoading && (productMissing || !product)) {
    return (
      <>
        <Seo title={t("panel.supplierProducts.notFound")} />
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-(--primary-text)">
            {t("panel.supplierProducts.notFound")}
          </p>
          <Link
            to="/supplier/products"
            className="mt-4 inline-flex text-sm font-semibold text-(--active) hover:underline"
          >
            {t("panel.supplierProducts.backToProducts")}
          </Link>
        </div>
      </>
    );
  }

  if (isEdit && productLoading && hydratedId !== productId) {
    return (
      <>
        <Seo title={t("panel.supplierProducts.edit.title")} />
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <EditorSkeleton />
        </div>
      </>
    );
  }

  const title = isResubmit
    ? t("panel.supplierProducts.resubmit.title", {
        defaultValue: "Resubmit Product",
      })
    : isEdit
      ? t("panel.supplierProducts.edit.title")
      : t("panel.supplierProducts.add.title");

  const submitting = creating || updating || resubmitting;

  const resolveWarehouseLabel = (value) => {
    const match = warehouseOptions.find((option) => option.value === value);
    return match?.label && match.value ? match.label : value;
  };

  const handleAiAssist = async (section, current) => {
    try {
      const result = await generateAi({
        title: current.title,
        field: resolveAiField(section),
      }).unwrap();
      return (
        result?.text ||
        result?.content ||
        result?.data?.text ||
        result?.[section] ||
        result?.[resolveAiField(section)] ||
        ""
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t("panel.supplierProducts.aiFailed", {
            defaultValue: "Could not generate AI text.",
          }),
        ),
      );
      return "";
    }
  };

  const handleSubmit = async (nextForm) => {
    if (submitting) return;

    const formData = buildProductFormData(
      {
        ...nextForm,
        warehouseLocationLabel: resolveWarehouseLabel(
          nextForm.warehouseLocation,
        ),
      },
      { includeLocked: !isEdit },
    );

    try {
      if (isResubmit && productId) {
        await resubmitProduct({ id: productId, formData }).unwrap();
      } else if (isEdit && productId) {
        await updateProduct({ id: productId, formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      navigate("/supplier/products");
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t("panel.supplierProducts.saveFailed", {
            defaultValue: "Could not save this product.",
          }),
        ),
      );
    }
  };

  return (
    <>
      <Seo title={title} />

      <AddProduct
        key={isEdit ? `edit-${productId}` : "add"}
        role="supplier"
        value={form}
        onChange={setForm}
        warehouseOptions={warehouseOptions}
        categoryOptions={categoryOptions}
        subCategoryOptions={subCategoryOptions}
        productTypeOptions={productTypeOptions}
        breadcrumb={
          isResubmit
            ? t("panel.supplierProducts.resubmit.breadcrumb", {
                defaultValue: "Product > Resubmit Product",
              })
            : isEdit
              ? t("panel.supplierProducts.edit.breadcrumb")
              : t("panel.supplierProducts.add.breadcrumb")
        }
        title={title}
        submitLabel={
          submitting
            ? t("panel.supplierProducts.saving", { defaultValue: "Saving…" })
            : isResubmit
              ? t("panel.supplierProducts.resubmit.submit", {
                  defaultValue: "RESUBMIT",
                })
              : isEdit
                ? t("panel.supplierProducts.edit.submit")
                : t("panel.supplierProducts.add.submit")
        }
        onBack={() => navigate("/supplier/products")}
        onAiAssist={handleAiAssist}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function EditorSkeleton() {
  return (
    <div
      className="space-y-8"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`editor-top-${index}`}
              className="h-12 w-full rounded-lg"
            />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={`editor-mid-${index}`}
              className="h-12 w-full rounded-lg"
            />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`editor-section-${index}`} className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="pt-2">
          <Skeleton className="h-14 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
