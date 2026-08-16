import { Suspense, lazy } from 'react';
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PublicLayout from '../../layouts/PublicLayout/PublicLayout';
import BuyerLayout from '../../layouts/BuyerLayout/BuyerLayout';
import PanelLayout from '../../layouts/PanelLayout/PanelLayout';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton';
import AuthSkeleton from '../../components/common/Skeleton/AuthSkeleton';
import BuyerSkeleton from '../../components/common/Skeleton/BuyerSkeleton';
import PanelSkeleton from '../../components/common/Skeleton/PanelSkeleton';
import HomeSkeleton from '../../components/common/Skeleton/HomeSkeleton';
import ScrollToTop from '../../components/common/ScrollToTop/ScrollToTop';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { routeSeo } from '../../config/seo';
import { PANEL_ROLE_IDS, BUYER_ROLE_IDS } from '../../roles';
import { logout } from '../../features/auth/authSlice';

/* ─── Loadable (lazy + Suspense) ─────────────────────────────────── */

const Loadable =
  (Component, fallback = <PageSkeleton />) =>
  (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );

/* ─── Public / auth / shared ─────────────────────────────────────── */

const Home = Loadable(
  lazy(() => import('../../pages/public_page/HomePage')),
  <HomeSkeleton />,
);
const PublicProducts = Loadable(
  lazy(() => import('../../pages/public_page/products/ProductsPage')),
);
const PublicProductDetail = Loadable(
  lazy(() => import('../../pages/public_page/products/ProductDetailPage')),
);
const UserCheckout = Loadable(
  lazy(() => import('../../pages/public_page/checkout/UserCheckoutPage')),
);
const CompanyCheckout = Loadable(
  lazy(() => import('../../pages/public_page/checkout/CompanyCheckoutPage')),
);
const OrderConfirmation = Loadable(
  lazy(() => import('../../pages/public_page/checkout/OrderConfirmationPage')),
);
const PublicCart = Loadable(
  lazy(() => import('../../pages/public_page/cart/CartPage')),
);
const PublicMessages = Loadable(
  lazy(() => import('../../pages/public_page/messages/MessagesPage')),
);
const DisputeResolutionList = Loadable(
  lazy(() => import('../../pages/public_page/disputes/DisputesListPage')),
);
const DisputeResolutionDetail = Loadable(
  lazy(() => import('../../pages/public_page/disputes/DisputeDetailPage')),
);
const ReturnsOrders = Loadable(
  lazy(() => import('../../pages/public_page/disputes/ReturnsOrdersPage')),
);
const ReturnOrderDetail = Loadable(
  lazy(() => import('../../pages/public_page/disputes/ReturnOrderDetailPage')),
);
const ReturnRequestDetail = Loadable(
  lazy(
    () => import('../../pages/public_page/disputes/ReturnRequestDetailPage'),
  ),
);
const HelpCenter = Loadable(
  lazy(() => import('../../pages/public_page/legal/HelpCenterPage')),
);
const ReturnPolicy = Loadable(
  lazy(() => import('../../pages/public_page/legal/ReturnPolicyPage')),
);
const PrivacyPolicy = Loadable(
  lazy(() => import('../../pages/public_page/legal/PrivacyPolicyPage')),
);
const TermsAndConditions = Loadable(
  lazy(() => import('../../pages/public_page/legal/TermsAndConditionsPage')),
);
const Developer = Loadable(
  lazy(() => import('../../pages/public_page/DeveloperPage')),
);
const NotFound = Loadable(
  lazy(() => import('../../pages/public_page/NotFoundPage')),
);
const ComingSoon = Loadable(
  lazy(() => import('../../pages/shared/ComingSoonPage')),
  <PanelSkeleton />,
);
const RoleSelect = Loadable(
  lazy(() => import('../../pages/auth/RoleSelectPage')),
  <AuthSkeleton />,
);
const Login = Loadable(
  lazy(() => import('../../pages/auth/LoginPage')),
  <AuthSkeleton />,
);
const Register = Loadable(
  lazy(() => import('../../pages/auth/RegisterPage')),
  <AuthSkeleton />,
);
const ForgotPassword = Loadable(
  lazy(() => import('../../pages/auth/ForgotPasswordPage')),
  <AuthSkeleton />,
);
const OtpVerification = Loadable(
  lazy(() => import('../../pages/auth/OtpVerificationPage')),
  <AuthSkeleton />,
);
const ResetPassword = Loadable(
  lazy(() => import('../../pages/auth/ResetPasswordPage')),
  <AuthSkeleton />,
);

/* ─── Customer ───────────────────────────────────────────────────── */

const CustomerDashboard = Loadable(
  lazy(() => import('../../pages/customer/dashboard/DashboardPage')),
  <BuyerSkeleton />,
);
const CustomerOrders = Loadable(
  lazy(() => import('../../pages/customer/orders/OrdersPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CustomerOrderDetail = Loadable(
  lazy(() => import('../../pages/customer/orders/OrderDetailPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CustomerProductToReview = Loadable(
  lazy(
    () => import('../../pages/customer/product-to-review/ProductToReviewPage'),
  ),
  <BuyerSkeleton variant='placeholder' />,
);
const CustomerWriteReview = Loadable(
  lazy(() => import('../../pages/customer/product-to-review/WriteReviewPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CustomerProfile = Loadable(
  lazy(() => import('../../pages/customer/profile/ProfilePage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CustomerAffiliates = Loadable(
  lazy(() => import('../../pages/customer/affiliates/AffiliatesPage')),
  <BuyerSkeleton variant='placeholder' />,
);

/* ─── Company ────────────────────────────────────────────────────── */

const CompanyDashboard = Loadable(
  lazy(() => import('../../pages/company/dashboard/DashboardPage')),
  <BuyerSkeleton />,
);
const CompanyOrders = Loadable(
  lazy(() => import('../../pages/company/orders/OrdersPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyOrderDetail = Loadable(
  lazy(() => import('../../pages/company/orders/OrderDetailPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyProjects = Loadable(
  lazy(() => import('../../pages/company/projects/ProjectsPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyProjectDetail = Loadable(
  lazy(() => import('../../pages/company/projects/ProjectDetailPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyMaterialDetail = Loadable(
  lazy(() => import('../../pages/company/projects/MaterialDetailPage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyProfile = Loadable(
  lazy(() => import('../../pages/company/profile/ProfilePage')),
  <BuyerSkeleton variant='placeholder' />,
);
const CompanyAffiliates = Loadable(
  lazy(() => import('../../pages/company/affiliates/AffiliatesPage')),
  <BuyerSkeleton variant='placeholder' />,
);

/* ─── Supplier ───────────────────────────────────────────────────── */

const SupplierDashboard = Loadable(
  lazy(() => import('../../pages/supplier/dashboard/DashboardPage')),
  <PanelSkeleton />,
);
const SupplierProducts = Loadable(
  lazy(() => import('../../pages/supplier/products/ProductsPage')),
  <PanelSkeleton />,
);
const SupplierProductDetail = Loadable(
  lazy(() => import('../../pages/supplier/products/ProductDetailPage')),
  <PanelSkeleton />,
);
const SupplierAddProduct = Loadable(
  lazy(() => import('../../pages/supplier/products/AddProductPage')),
  <PanelSkeleton />,
);
const SupplierPromoCodes = Loadable(
  lazy(() => import('../../pages/supplier/promo-codes/PromoCodesPage')),
  <PanelSkeleton />,
);
const SupplierCreatePromoCode = Loadable(
  lazy(() => import('../../pages/supplier/promo-codes/CreatePromoCodePage')),
  <PanelSkeleton />,
);
const SupplierOrdersCustomer = Loadable(
  lazy(() => import('../../pages/supplier/orders-customer/OrdersCustomerPage')),
  <PanelSkeleton />,
);
const SupplierOrderCustomerDetail = Loadable(
  lazy(
    () =>
      import('../../pages/supplier/orders-customer/OrderCustomerDetailPage'),
  ),
  <PanelSkeleton />,
);
const SupplierCompanyOrders = Loadable(
  lazy(() => import('../../pages/supplier/company-orders/CompanyOrdersPage')),
  <PanelSkeleton />,
);
const SupplierOrderCompanyDetail = Loadable(
  lazy(
    () => import('../../pages/supplier/company-orders/OrderCompanyDetailPage'),
  ),
  <PanelSkeleton />,
);
const SupplierDocuments = Loadable(
  lazy(() => import('../../pages/supplier/documents/DocumentsPage')),
  <PanelSkeleton />,
);
const SupplierChat = Loadable(
  lazy(() => import('../../pages/supplier/chat/ChatPage')),
  <PanelSkeleton />,
);
const SupplierBuyFromFactory = Loadable(
  lazy(
    () => import('../../pages/supplier/buy-from-factory/BuyFromFactoryPage'),
  ),
  <PanelSkeleton />,
);
const SupplierBuyFromFactoryDetail = Loadable(
  lazy(
    () =>
      import('../../pages/supplier/buy-from-factory/BuyFromFactoryDetailPage'),
  ),
  <PanelSkeleton />,
);
const SupplierFactoryOrders = Loadable(
  lazy(() => import('../../pages/supplier/factory-orders/FactoryOrdersPage')),
  <PanelSkeleton />,
);
const SupplierFactoryOrderDetail = Loadable(
  lazy(
    () => import('../../pages/supplier/factory-orders/FactoryOrderDetailPage'),
  ),
  <PanelSkeleton />,
);
const SupplierInventory = Loadable(
  lazy(() => import('../../pages/supplier/inventory/InventoryPage')),
  <PanelSkeleton />,
);
const SupplierDeliveryLogistics = Loadable(
  lazy(
    () =>
      import('../../pages/supplier/delivery-logistics/DeliveryLogisticsPage'),
  ),
  <PanelSkeleton />,
);
const SupplierPaymentsFinance = Loadable(
  lazy(
    () => import('../../pages/supplier/payments-finance/PaymentsFinancePage'),
  ),
  <PanelSkeleton />,
);
const SupplierAnalytics = Loadable(
  lazy(() => import('../../pages/supplier/analytics/AnalyticsPage')),
  <PanelSkeleton />,
);
const SupplierReviews = Loadable(
  lazy(() => import('../../pages/supplier/reviews/ReviewsPage')),
  <PanelSkeleton />,
);
const SupplierReturnRequests = Loadable(
  lazy(() => import('../../pages/supplier/return-requests/ReturnRequestsPage')),
  <PanelSkeleton />,
);
const SupplierReturnRequestDetail = Loadable(
  lazy(
    () => import('../../pages/supplier/return-requests/ReturnRequestDetailPage'),
  ),
  <PanelSkeleton />,
);
const SupplierDisputes = Loadable(
  lazy(() => import('../../pages/supplier/disputes/DisputesPage')),
  <PanelSkeleton />,
);
const SupplierDisputeDetail = Loadable(
  lazy(() => import('../../pages/supplier/disputes/DisputeDetailPage')),
  <PanelSkeleton />,
);
const SupplierInvoices = Loadable(
  lazy(() => import('../../pages/supplier/invoices/InvoicesPage')),
  <PanelSkeleton />,
);
const SupplierProfile = Loadable(
  lazy(() => import('../../pages/supplier/profile/ProfilePage')),
  <PanelSkeleton />,
);

/* ─── Factory ────────────────────────────────────────────────────── */

const FactoryDashboard = Loadable(
  lazy(() => import('../../pages/factory/dashboard/DashboardPage')),
  <PanelSkeleton />,
);
const FactoryProducts = Loadable(
  lazy(() => import('../../pages/factory/products/ProductsPage')),
  <PanelSkeleton />,
);
const FactoryOrders = Loadable(
  lazy(() => import('../../pages/factory/orders/OrdersPage')),
  <PanelSkeleton />,
);
const FactoryChat = Loadable(
  lazy(() => import('../../pages/factory/chat/ChatPage')),
  <PanelSkeleton />,
);
const FactoryDeliveryLogistics = Loadable(
  lazy(
    () =>
      import('../../pages/factory/delivery-logistics/DeliveryLogisticsPage'),
  ),
  <PanelSkeleton />,
);
const FactoryInvoices = Loadable(
  lazy(() => import('../../pages/factory/invoices/InvoicesPage')),
  <PanelSkeleton />,
);
const FactoryProfile = Loadable(
  lazy(() => import('../../pages/factory/profile/ProfilePage')),
  <PanelSkeleton />,
);

/* ─── Transporter ────────────────────────────────────────────────── */

const TransporterDashboard = Loadable(
  lazy(() => import('../../pages/transporter/dashboard/DashboardPage')),
  <PanelSkeleton />,
);
const TransporterAuctionBoard = Loadable(
  lazy(() => import('../../pages/transporter/auction-board/AuctionBoardPage')),
  <PanelSkeleton />,
);
const TransporterAssignDeliveries = Loadable(
  lazy(
    () =>
      import('../../pages/transporter/assign-deliveries/AssignDeliveriesPage'),
  ),
  <PanelSkeleton />,
);
const TransporterPaymentsPayouts = Loadable(
  lazy(
    () =>
      import('../../pages/transporter/payments-payouts/PaymentsPayoutsPage'),
  ),
  <PanelSkeleton />,
);
const TransporterOrderHistory = Loadable(
  lazy(() => import('../../pages/transporter/order-history/OrderHistoryPage')),
  <PanelSkeleton />,
);
const TransporterInsurance = Loadable(
  lazy(() => import('../../pages/transporter/insurance/InsurancePage')),
  <PanelSkeleton />,
);
const TransporterMap = Loadable(
  lazy(() => import('../../pages/transporter/map/MapPage')),
  <PanelSkeleton />,
);
const TransporterInvoices = Loadable(
  lazy(() => import('../../pages/transporter/invoices/InvoicesPage')),
  <PanelSkeleton />,
);
const TransporterProfile = Loadable(
  lazy(() => import('../../pages/transporter/profile/ProfilePage')),
  <PanelSkeleton />,
);

/* ─── Affiliate ──────────────────────────────────────────────────── */

const AffiliateOverview = Loadable(
  lazy(
    () =>
      import('../../pages/affiliate/overview-dashboard/OverviewDashboardPage'),
  ),
  <PanelSkeleton />,
);
const AffiliateReferralChannels = Loadable(
  lazy(
    () =>
      import('../../pages/affiliate/referral-channels/ReferralChannelsPage'),
  ),
  <PanelSkeleton />,
);
const AffiliateReferredClients = Loadable(
  lazy(
    () => import('../../pages/affiliate/referred-clients/ReferredClientsPage'),
  ),
  <PanelSkeleton />,
);
const AffiliateCommissions = Loadable(
  lazy(() => import('../../pages/affiliate/commissions/CommissionsPage')),
  <PanelSkeleton />,
);
const AffiliateLevels = Loadable(
  lazy(
    () => import('../../pages/affiliate/affiliate-levels/AffiliateLevelsPage'),
  ),
  <PanelSkeleton />,
);
const AffiliateSettings = Loadable(
  lazy(() => import('../../pages/affiliate/settings/SettingsPage')),
  <PanelSkeleton />,
);

/* ─── Admin ──────────────────────────────────────────────────────── */

const AdminDashboard = Loadable(
  lazy(() => import('../../pages/admin/dashboard/DashboardPage')),
  <PanelSkeleton />,
);
const AdminUserManagement = Loadable(
  lazy(() => import('../../pages/admin/user-management/UserManagementPage')),
  <PanelSkeleton />,
);
const AdminSupplierManagement = Loadable(
  lazy(
    () =>
      import('../../pages/admin/supplier-management/SupplierManagementPage'),
  ),
  <PanelSkeleton />,
);
const AdminFactoryManagement = Loadable(
  lazy(
    () => import('../../pages/admin/factory-management/FactoryManagementPage'),
  ),
  <PanelSkeleton />,
);
const AdminTransporterManagement = Loadable(
  lazy(
    () =>
      import('../../pages/admin/transporter-management/TransporterManagementPage'),
  ),
  <PanelSkeleton />,
);
const AdminProductModeration = Loadable(
  lazy(
    () => import('../../pages/admin/product-moderation/ProductModerationPage'),
  ),
  <PanelSkeleton />,
);
const AdminProductModerationDetail = Loadable(
  lazy(
    () =>
      import('../../pages/admin/product-moderation/ProductModerationDetailPage'),
  ),
  <PanelSkeleton />,
);
const AdminChat = Loadable(
  lazy(() => import('../../pages/admin/chat/ChatPage')),
  <PanelSkeleton />,
);
const AdminMarketingManagement = Loadable(
  lazy(
    () =>
      import('../../pages/admin/marketing-management/MarketingManagementPage'),
  ),
  <PanelSkeleton />,
);
const AdminFinancePayments = Loadable(
  lazy(() => import('../../pages/admin/finance-payments/FinancePaymentsPage')),
  <PanelSkeleton />,
);
const AdminDisputes = Loadable(
  lazy(() => import('../../pages/admin/disputes/DisputesPage')),
  <PanelSkeleton />,
);
const AdminDisputeDetail = Loadable(
  lazy(() => import('../../pages/admin/disputes/AdminDisputeDetailPage')),
  <PanelSkeleton />,
);
const AdminAuction = Loadable(
  lazy(() => import('../../pages/admin/auction/AuctionPage')),
  <PanelSkeleton />,
);
const AdminOrders = Loadable(
  lazy(() => import('../../pages/admin/orders/OrdersPage')),
  <PanelSkeleton />,
);
const AdminOrderDetail = Loadable(
  lazy(() => import('../../pages/admin/orders/AdminOrderDetailPage')),
  <PanelSkeleton />,
);
const AdminDeliveryLogistics = Loadable(
  lazy(
    () => import('../../pages/admin/delivery-logistics/DeliveryLogisticsPage'),
  ),
  <PanelSkeleton />,
);
const AdminDeliveryLogisticsDetail = Loadable(
  lazy(
    () =>
      import('../../pages/admin/delivery-logistics/DeliveryLogisticsDetailPage'),
  ),
  <PanelSkeleton />,
);
const AdminAffiliateDirectory = Loadable(
  lazy(
    () =>
      import('../../pages/admin/affiliate-directory/AffiliateDirectoryPage'),
  ),
  <PanelSkeleton />,
);
const AdminAffiliateDetail = Loadable(
  lazy(
    () => import('../../pages/admin/affiliate-directory/AffiliateDetailPage'),
  ),
  <PanelSkeleton />,
);
const AdminRolesPermissions = Loadable(
  lazy(
    () => import('../../pages/admin/roles-permissions/RolesPermissionsPage'),
  ),
  <PanelSkeleton />,
);
const AdminSettings = Loadable(
  lazy(() => import('../../pages/admin/settings/SettingsPage')),
  <PanelSkeleton />,
);
const AdminProfile = Loadable(
  lazy(() => import('../../pages/admin/profile/ProfilePage')),
  <PanelSkeleton />,
);

/* ─── Shells ─────────────────────────────────────────────────────── */

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

function useAuthLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  return () => {
    dispatch(logout());
    navigate(user?.role === 'admin' ? '/admin/login' : '/login', {
      replace: true,
    });
  };
}

function BuyerShell() {
  const user = useSelector((state) => state.auth.user);
  const onLogout = useAuthLogout();
  const role = BUYER_ROLE_IDS.includes(user?.role) ? user.role : 'company';

  return (
    <BuyerLayout
      role={role}
      userName={user?.name?.split(' ')[0] || 'User'}
      onLogout={onLogout}
    />
  );
}

function PanelShell() {
  const user = useSelector((state) => state.auth.user);
  const onLogout = useAuthLogout();
  const role = PANEL_ROLE_IDS.includes(user?.role) ? user.role : 'supplier';

  return (
    <PanelLayout
      role={role}
      userName={user?.name || 'User'}
      onLogout={onLogout}
    />
  );
}

function panelSeo(titleKey) {
  return {
    seo: {
      titleKey,
      descriptionKey: 'seo.panelDescription',
    },
  };
}

/* ─── Router ─────────────────────────────────────────────────────── */

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      /* Public site */
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Home />, handle: { seo: routeSeo.home } },
          {
            path: '/products/:slug',
            element: <PublicProductDetail />,
            handle: { seo: routeSeo.productDetail },
          },
          {
            path: '/products',
            element: <PublicProducts />,
            handle: { seo: routeSeo.products },
          },
          {
            path: '/cart',
            element: <PublicCart />,
            handle: { seo: routeSeo.cart },
          },

          {
            path: '/messages',
            element: <PublicMessages />,
            handle: { seo: routeSeo.messages },
          },
          {
            path: '/order/confirmation',
            element: <OrderConfirmation />,
            handle: { seo: routeSeo.orderConfirmation },
          },
          {
            path: '/checkout/company',
            element: <CompanyCheckout />,
            handle: { seo: routeSeo.companyCheckout },
          },
          {
            path: '/checkout',
            element: <UserCheckout />,
            handle: { seo: routeSeo.userCheckout },
          },
          {
            path: '/terms-and-conditions',
            element: <TermsAndConditions />,
            handle: { seo: routeSeo.termsAndConditions },
          },
          {
            path: '/privacy-policy',
            element: <PrivacyPolicy />,
            handle: { seo: routeSeo.privacyPolicy },
          },
          {
            path: '/help-center',
            element: <HelpCenter />,
            handle: { seo: routeSeo.helpCenter },
          },
          {
            path: '/return-policy',
            element: <ReturnPolicy />,
            handle: { seo: routeSeo.returnPolicy },
          },
          {
            path: '/dispute-resolution',
            element: <DisputeResolutionList />,
            handle: { seo: routeSeo.disputeResolution },
          },
          {
            path: '/dispute-resolution/:disputeId',
            element: <DisputeResolutionDetail />,
            handle: { seo: routeSeo.disputeResolution },
          },
          {
            path: '/returns',
            element: <ReturnsOrders />,
            handle: { seo: routeSeo.returnsCenter },
          },
          {
            path: '/returns/request/:returnId',
            element: <ReturnRequestDetail />,
            handle: { seo: routeSeo.returnsCenter },
          },
          {
            path: '/returns/:orderId',
            element: <ReturnOrderDetail />,
            handle: { seo: routeSeo.returnsCenter },
          },
        ],
      },

      /* Auth (guest only) */
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: '/signup',
                element: <RoleSelect />,
                handle: { seo: routeSeo.signup },
              },
              {
                path: '/signup/:role',
                element: <Register />,
                handle: { seo: routeSeo.signup },
              },
              // {
              //   path: "/admin/login",
              //   element: <ComingSoon hideTitle />,
              //   handle: { seo: routeSeo.login },
              // },

              // {
              //   path: "/login",
              //   element: <ComingSoon hideTitle />,
              //   handle: { seo: routeSeo.login },
              // },
              // {
              //   path: "/login/:role",
              //   element: <ComingSoon hideTitle />,
              //   handle: { seo: routeSeo.login },
              // },
              {
                path: '/login',
                element: <RoleSelect />,
                handle: { seo: routeSeo.login },
              },
              {
                path: '/login/:role',
                element: <Login />,
                handle: { seo: routeSeo.login },
              },
              {
                path: '/forgot-password',
                element: <ForgotPassword />,
                handle: { seo: routeSeo.forgotPassword },
              },
              {
                path: '/forgot-password/otp',
                element: <OtpVerification />,
                handle: { seo: routeSeo.forgotPassword },
              },
              {
                path: '/forgot-password/reset',
                element: <ResetPassword />,
                handle: { seo: routeSeo.forgotPassword },
              },
            ],
          },
        ],
      },
      // {
      //   element: <PublicRoute />,
      //   children: [
      //     {
      //       element: <AuthLayout />,
      //       children: [
      //         {
      //           path: "/signup",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.signup },
      //         },
      //         {
      //           path: "/signup/:role",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.signup },
      //         },
      //         {
      //           path: "/admin/login",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.login },
      //         },
      // {
      //   path: "/login",
      //   element: <RoleSelect />,
      //   handle: { seo: routeSeo.login },
      // },
      // {
      //   path: "/login/:role",
      //   element: <Login />,
      //   handle: { seo: routeSeo.login },
      // },
      //         {
      //           path: "/forgot-password",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.forgotPassword },
      //         },
      //         {
      //           path: "/forgot-password/otp",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.forgotPassword },
      //         },
      //         {
      //           path: "/forgot-password/reset",
      //           element: <ComingSoon hideTitle />,
      //           handle: { seo: routeSeo.forgotPassword },
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: '/signup',
                element: <RoleSelect />,
                handle: { seo: routeSeo.signup },
              },
              {
                path: '/signup/:role',
                element: <Register />,
                handle: { seo: routeSeo.signup },
              },
              {
                path: '/admin/login',
                element: <Login />,
                handle: { seo: routeSeo.login },
              },
              {
                path: '/login',
                element: <RoleSelect />,
                handle: { seo: routeSeo.login },
              },
              {
                path: '/login/:role',
                element: <Login />,
                handle: { seo: routeSeo.login },
              },
              {
                path: '/forgot-password',
                element: <ForgotPassword />,
                handle: { seo: routeSeo.forgotPassword },
              },
              {
                path: '/forgot-password/otp',
                element: <OtpVerification />,
                handle: { seo: routeSeo.forgotPassword },
              },
              {
                path: '/forgot-password/reset',
                element: <ResetPassword />,
                handle: { seo: routeSeo.forgotPassword },
              },
            ],
          },
        ],
      },

      /* Developer docs */
      { path: '/developer', element: <Developer /> },
      { path: '/developer/:componentId', element: <Developer /> },

      /* Customer */
      {
        path: '/customer',
        element: <ProtectedRoute allowedRoles={['customer']} />,
        children: [
          {
            element: <BuyerShell />,
            children: [
              {
                index: true,
                element: <CustomerDashboard />,
                handle: { seo: routeSeo.buyerDashboard },
              },
              {
                path: 'orders',
                element: <CustomerOrders />,
                handle: { seo: routeSeo.buyerOrders },
              },
              {
                path: 'orders/:orderId',
                element: <CustomerOrderDetail />,
                handle: { seo: routeSeo.buyerOrders },
              },
              {
                path: 'product-to-review',
                element: <CustomerProductToReview />,
                handle: { seo: routeSeo.buyerProductToReview },
              },
              {
                path: 'product-to-review/:reviewId',
                element: <CustomerWriteReview />,
                handle: { seo: routeSeo.buyerProductToReview },
              },
              {
                path: 'profile',
                element: <CustomerProfile />,
                handle: { seo: routeSeo.buyerDashboard },
              },
              {
                path: 'affiliates',
                element: <CustomerAffiliates />,
                handle: { seo: routeSeo.buyerDashboard },
              },
            ],
          },
        ],
      },

      /* Company */
      {
        path: '/company',
        element: <ProtectedRoute allowedRoles={['company']} />,
        children: [
          {
            element: <BuyerShell />,
            children: [
              {
                index: true,
                element: <CompanyDashboard />,
                handle: { seo: routeSeo.buyerDashboard },
              },
              {
                path: 'orders',
                element: <CompanyOrders />,
                handle: { seo: routeSeo.buyerOrders },
              },
              {
                path: 'orders/:orderId',
                element: <CompanyOrderDetail />,
                handle: { seo: routeSeo.buyerOrders },
              },
              {
                path: 'projects',
                element: <CompanyProjects />,
                handle: { seo: routeSeo.buyerProjects },
              },
              {
                path: 'projects/:projectId',
                element: <CompanyProjectDetail />,
                handle: { seo: routeSeo.buyerProjects },
              },
              {
                path: 'projects/:projectId/materials/:materialId',
                element: <CompanyMaterialDetail />,
                handle: { seo: routeSeo.buyerProjects },
              },
              {
                path: 'profile',
                element: <CompanyProfile />,
                handle: { seo: routeSeo.buyerDashboard },
              },
              {
                path: 'affiliates',
                element: <CompanyAffiliates />,
                handle: { seo: routeSeo.buyerDashboard },
              },
            ],
          },
        ],
      },

      /* Supplier */
      {
        path: '/supplier',
        element: <ProtectedRoute allowedRoles={['supplier']} />,
        children: [
          {
            element: <PanelShell />,
            children: [
              {
                index: true,
                element: <SupplierDashboard />,
                handle: panelSeo('panel.nav.dashboard'),
              },
              {
                path: 'products',
                element: <SupplierProducts />,
                handle: panelSeo('panel.nav.products'),
              },
              {
                path: 'products/add',
                element: <SupplierAddProduct />,
                handle: panelSeo('panel.nav.products'),
              },
              {
                path: 'products/:productId',
                element: <SupplierProductDetail />,
                handle: panelSeo('panel.nav.products'),
              },
              {
                path: 'promo-codes',
                element: <SupplierPromoCodes />,
                handle: panelSeo('panel.nav.promoCode'),
              },
              {
                path: 'promo-codes/create',
                element: <SupplierCreatePromoCode />,
                handle: panelSeo('panel.nav.promoCode'),
              },
              {
                path: 'orders-customer/:orderId',
                element: <SupplierOrderCustomerDetail />,
                handle: panelSeo(
                  'panel.supplierCustomerOrders.orderDetailsTitle',
                ),
              },
              {
                path: 'orders-customer',
                element: <SupplierOrdersCustomer />,
                handle: panelSeo('panel.nav.ordersCustomer'),
              },
              {
                path: 'company-orders/:orderId',
                element: <SupplierOrderCompanyDetail />,
                handle: panelSeo(
                  'panel.supplierCompanyOrders.orderDetailsTitle',
                ),
              },
              {
                path: 'company-orders',
                element: <SupplierCompanyOrders />,
                handle: panelSeo('panel.nav.companyOrders'),
              },
              {
                path: 'documents',
                element: <SupplierDocuments />,
                handle: panelSeo('panel.nav.document'),
              },
              {
                path: 'chat',
                element: <SupplierChat />,
                handle: panelSeo('panel.nav.chat'),
              },
              {
                path: 'buy-from-factory/:productId',
                element: <SupplierBuyFromFactoryDetail />,
                handle: panelSeo('panel.nav.buyFromFactory'),
              },
              {
                path: 'buy-from-factory',
                element: <SupplierBuyFromFactory />,
                handle: panelSeo('panel.nav.buyFromFactory'),
              },
              {
                path: 'factory-orders/:orderId',
                element: <SupplierFactoryOrderDetail />,
                handle: panelSeo('panel.nav.factoryOrder'),
              },
              {
                path: 'factory-orders',
                element: <SupplierFactoryOrders />,
                handle: panelSeo('panel.nav.factoryOrder'),
              },
              {
                path: 'inventory',
                element: <SupplierInventory />,
                handle: panelSeo('panel.nav.inventory'),
              },
              {
                path: 'delivery-logistics',
                element: <SupplierDeliveryLogistics />,
                handle: panelSeo('panel.nav.deliveryLogistics'),
              },
              {
                path: 'payments-finance',
                element: <SupplierPaymentsFinance />,
                handle: panelSeo('panel.nav.paymentsFinance'),
              },
              {
                path: 'analytics',
                element: <SupplierAnalytics />,
                handle: panelSeo('panel.nav.analytics'),
              },
              {
                path: 'reviews',
                element: <SupplierReviews />,
                handle: panelSeo('panel.nav.reviews'),
              },
              {
                path: 'return-requests/:returnId',
                element: <SupplierReturnRequestDetail />,
                handle: panelSeo('panel.nav.returnRequests'),
              },
              {
                path: 'return-requests',
                element: <SupplierReturnRequests />,
                handle: panelSeo('panel.nav.returnRequests'),
              },
              {
                path: 'disputes/:disputeId',
                element: <SupplierDisputeDetail />,
                handle: panelSeo('panel.nav.disputesResolution'),
              },
              {
                path: 'disputes',
                element: <SupplierDisputes />,
                handle: panelSeo('panel.nav.disputesResolution'),
              },
              {
                path: 'invoices',
                element: <SupplierInvoices />,
                handle: panelSeo('panel.nav.invoices'),
              },
              {
                path: 'profile',
                element: <SupplierProfile />,
                handle: panelSeo('panel.nav.profile'),
              },
              {
                path: '*',
                element: <ComingSoon />,
                handle: panelSeo('panel.nav.dashboard'),
              },
            ],
          },
        ],
      },

      /* Factory */
      {
        path: '/factory',
        element: <ProtectedRoute allowedRoles={['factory']} />,
        children: [
          {
            element: <PanelShell />,
            children: [
              {
                index: true,
                element: <FactoryDashboard />,
                handle: panelSeo('panel.nav.dashboard'),
              },
              {
                path: 'products',
                element: <FactoryProducts />,
                handle: panelSeo('panel.nav.products'),
              },
              {
                path: 'orders',
                element: <FactoryOrders />,
                handle: panelSeo('panel.nav.orders'),
              },
              {
                path: 'chat',
                element: <FactoryChat />,
                handle: panelSeo('panel.nav.chat'),
              },
              {
                path: 'delivery-logistics',
                element: <FactoryDeliveryLogistics />,
                handle: panelSeo('panel.nav.deliveryLogistics'),
              },
              {
                path: 'invoices',
                element: <FactoryInvoices />,
                handle: panelSeo('panel.nav.invoices'),
              },
              {
                path: 'profile',
                element: <FactoryProfile />,
                handle: panelSeo('panel.nav.profile'),
              },
              {
                path: '*',
                element: <ComingSoon />,
                handle: panelSeo('panel.nav.dashboard'),
              },
            ],
          },
        ],
      },

      /* Transporter */
      {
        path: '/transporter',
        element: <ProtectedRoute allowedRoles={['transporter']} />,
        children: [
          {
            element: <PanelShell />,
            children: [
              {
                index: true,
                element: <TransporterDashboard />,
                handle: panelSeo('panel.nav.dashboard'),
              },
              {
                path: 'auction-board',
                element: <TransporterAuctionBoard />,
                handle: panelSeo('panel.nav.auctionBoard'),
              },
              {
                path: 'assign-deliveries',
                element: <TransporterAssignDeliveries />,
                handle: panelSeo('panel.nav.assignDeliveries'),
              },
              {
                path: 'payments-payouts',
                element: <TransporterPaymentsPayouts />,
                handle: panelSeo('panel.nav.paymentsPayouts'),
              },
              {
                path: 'order-history',
                element: <TransporterOrderHistory />,
                handle: panelSeo('panel.nav.orderHistory'),
              },
              {
                path: 'insurance',
                element: <TransporterInsurance />,
                handle: panelSeo('panel.nav.insurance'),
              },
              {
                path: 'map',
                element: <TransporterMap />,
                handle: panelSeo('panel.nav.map'),
              },
              {
                path: 'invoices',
                element: <TransporterInvoices />,
                handle: panelSeo('panel.nav.invoices'),
              },
              {
                path: 'profile',
                element: <TransporterProfile />,
                handle: panelSeo('panel.nav.profile'),
              },
              {
                path: '*',
                element: <ComingSoon />,
                handle: panelSeo('panel.nav.dashboard'),
              },
            ],
          },
        ],
      },

      /* Affiliate */
      {
        path: '/affiliate',
        element: <ProtectedRoute allowedRoles={['affiliate']} />,
        children: [
          {
            element: <PanelShell />,
            children: [
              {
                index: true,
                element: <AffiliateOverview />,
                handle: panelSeo('panel.nav.overviewDashboard'),
              },
              {
                path: 'referral-channels',
                element: <AffiliateReferralChannels />,
                handle: panelSeo('panel.nav.referralChannels'),
              },
              {
                path: 'referred-clients',
                element: <AffiliateReferredClients />,
                handle: panelSeo('panel.nav.referredClients'),
              },
              {
                path: 'commissions',
                element: <AffiliateCommissions />,
                handle: panelSeo('panel.nav.commissions'),
              },
              {
                path: 'affiliate-levels',
                element: <AffiliateLevels />,
                handle: panelSeo('panel.nav.affiliateLevels'),
              },
              {
                path: 'settings',
                element: <AffiliateSettings />,
                handle: panelSeo('panel.nav.settings'),
              },
              {
                path: '*',
                element: <ComingSoon />,
                handle: panelSeo('panel.nav.dashboard'),
              },
            ],
          },
        ],
      },

      /* Admin */
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']} redirectTo='/admin/login' />
        ),
        children: [
          {
            element: <PanelShell />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
                handle: panelSeo('panel.nav.dashboard'),
              },
              {
                path: 'user-management',
                element: <AdminUserManagement />,
                handle: panelSeo('panel.nav.userManagement'),
              },
              {
                path: 'supplier-management',
                element: <AdminSupplierManagement />,
                handle: panelSeo('panel.nav.supplierManagement'),
              },
              {
                path: 'factory-management',
                element: <AdminFactoryManagement />,
                handle: panelSeo('panel.nav.factoryManagement'),
              },
              {
                path: 'transporter-management',
                element: <AdminTransporterManagement />,
                handle: panelSeo('panel.nav.transporterManagement'),
              },
              {
                path: 'product-moderation',
                element: <AdminProductModeration />,
                handle: panelSeo('panel.nav.productModeration'),
              },
              {
                path: 'product-moderation/:productId',
                element: <AdminProductModerationDetail />,
                handle: panelSeo('panel.nav.productModeration'),
              },
              {
                path: 'chat',
                element: <AdminChat />,
                handle: panelSeo('panel.nav.chat'),
              },
              {
                path: 'marketing-management',
                element: <AdminMarketingManagement />,
                handle: panelSeo('panel.nav.marketingManagement'),
              },
              {
                path: 'finance-payments',
                element: <AdminFinancePayments />,
                handle: panelSeo('panel.nav.financePayments'),
              },
              {
                path: 'disputes',
                element: <AdminDisputes />,
                handle: panelSeo('panel.nav.disputesResolution'),
              },
              {
                path: 'disputes/:disputeId',
                element: <AdminDisputeDetail />,
                handle: panelSeo('panel.nav.disputesResolution'),
              },
              {
                path: 'auction',
                element: <AdminAuction />,
                handle: panelSeo('panel.nav.auction'),
              },
              {
                path: 'orders',
                element: <AdminOrders />,
                handle: panelSeo('panel.nav.orders'),
              },
              {
                path: 'orders/:orderId',
                element: <AdminOrderDetail />,
                handle: panelSeo('panel.nav.orders'),
              },
              {
                path: 'delivery-logistics',
                element: <AdminDeliveryLogistics />,
                handle: panelSeo('panel.nav.deliveryLogisticsAdmin'),
              },
              {
                path: 'delivery-logistics/:deliveryId',
                element: <AdminDeliveryLogisticsDetail />,
                handle: panelSeo('panel.nav.deliveryLogisticsAdmin'),
              },
              {
                path: 'affiliate-directory',
                element: <AdminAffiliateDirectory />,
                handle: panelSeo('panel.nav.affiliateDirectory'),
              },
              {
                path: 'affiliate-directory/:affiliateId',
                element: <AdminAffiliateDetail />,
                handle: panelSeo('panel.nav.affiliateDirectory'),
              },
              {
                path: 'roles-permissions',
                element: <AdminRolesPermissions />,
                handle: panelSeo('panel.nav.rolesPermissions'),
              },
              {
                path: 'settings',
                element: <AdminSettings />,
                handle: panelSeo('panel.nav.settings'),
              },
              {
                path: 'profile',
                element: <AdminProfile />,
                handle: panelSeo('panel.nav.profile'),
              },
              {
                path: '*',
                element: <ComingSoon />,
                handle: panelSeo('panel.nav.dashboard'),
              },
            ],
          },
        ],
      },

      /* 404 */
      {
        element: <PublicLayout />,
        children: [
          {
            path: '*',
            element: <NotFound />,
            handle: { seo: routeSeo.notFound },
          },
        ],
      },
    ],
  },
]);

export default router;
