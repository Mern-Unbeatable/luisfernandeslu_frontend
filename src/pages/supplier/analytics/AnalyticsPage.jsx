import {
  FiAlertCircle,
  FiDollarSign,
  FiTrendingDown,
  FiTrendingUp,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import StatusCard from '@/components/data-display/StatusCard';
import { DEMO_SUPPLIER_ANALYTICS } from '@/data/demoData';
import {
  RevenueBreakdownChart,
  RevenueExpensesProfitChart,
  SalesByCustomerTypeChart,
} from './AnalyticsCharts';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const stats = DEMO_SUPPLIER_ANALYTICS.stats;

  return (
    <>
      <Seo title={t('supplierAnalytics.title')} />
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-[var(--primary-text)]'>
            {t('supplierAnalytics.title')}
          </h1>
          <p className='mt-1 text-sm text-[var(--secondary-text)]'>
            {t('supplierAnalytics.subtitle')}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatusCard
            variant='filled'
            tone='brand'
            label={t('supplierAnalytics.cards.totalRevenue')}
            value={stats.totalRevenue}
            description={stats.totalRevenueGrowth}
            icon={FiDollarSign}
          />
          <StatusCard
            label={t('supplierAnalytics.cards.procurementExpenses')}
            value={stats.procurementExpenses}
            description={t('supplierAnalytics.cards.factoryPurchases')}
            icon={FiTrendingDown}
            iconTone='red'
            className='shadow-sm'
          />
          <StatusCard
            variant='status'
            tone='success'
            label={t('supplierAnalytics.cards.netProfit')}
            value={stats.netProfit}
            icon={FiTrendingUp}
            className='shadow-sm'
          />
          <StatusCard
            variant='status'
            tone='warning'
            label={t('supplierAnalytics.cards.outstandingDues')}
            value={stats.outstandingDues}
            description={t('supplierAnalytics.cards.fromCompanyClients')}
            icon={FiAlertCircle}
            className='shadow-sm'
          />
        </div>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
          <RevenueExpensesProfitChart />
          <RevenueBreakdownChart />
        </div>

        <SalesByCustomerTypeChart />
      </div>
    </>
  );
}
