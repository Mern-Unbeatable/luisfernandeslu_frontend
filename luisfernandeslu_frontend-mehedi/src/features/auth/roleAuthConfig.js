import {
  FiDollarSign,
  FiShield,
  FiClock,
  FiShare2,
  FiTrendingUp,
} from 'react-icons/fi'

/**
 * Role-driven auth UI config.
 * layout: 'photo' (customer/company) | 'marketing' (supplier/factory/transporter)
 * Register fields use type 'text'|'email'|'tel'|'password'|'file'
 */
const ROLE_AUTH = {
  customer: {
    id: 'customer',
    layout: 'photo',
    shortNameKey: 'auth.demo.customer',
    login: {
      titleKey: 'auth.loginTitle',
      subtitleKey: 'auth.loginSubtitle',
      showSocial: true,
      showDemo: true,
    },
    register: {
      titleKey: 'auth.register.customerTitle',
      showSocial: true,
      fields: [
        {
          name: 'fullName',
          labelKey: 'auth.register.fullName',
          placeholderKey: 'auth.register.fullNamePh',
          type: 'text',
          autoComplete: 'name',
        },
        {
          name: 'email',
          labelKey: 'auth.email',
          placeholderKey: 'auth.emailPlaceholder',
          type: 'email',
          autoComplete: 'email',
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh',
          type: 'password',
          autoComplete: 'new-password',
        },
      ],
    },
  },

  admin: {
    id: 'admin',
    layout: 'photo',
    shortNameKey: 'auth.demo.admin',
    login: {
      titleKey: 'auth.admin.loginTitle',
      subtitleKey: 'auth.admin.loginSubtitle',
      showSocial: false,
      showDemo: true,
    },
  },

  company: {
    id: 'company',
    layout: 'photo',
    shortNameKey: 'auth.demo.company',
    login: {
      titleKey: 'auth.loginTitle',
      subtitleKey: 'auth.loginSubtitle',
      showSocial: true,
      showDemo: true,
    },
    register: {
      titleKey: 'auth.register.companyTitle',
      showSocial: true,
      fields: [
        {
          name: 'companyName',
          labelKey: 'auth.register.companyName',
          placeholderKey: 'auth.register.companyNamePh',
          type: 'text',
        },
        {
          name: 'email',
          labelKey: 'auth.register.companyEmail',
          placeholderKey: 'auth.register.companyEmailPh',
          type: 'email',
          autoComplete: 'email',
        },
        {
          name: 'nif',
          labelKey: 'auth.register.nif',
          placeholderKey: 'auth.register.nifPh',
          type: 'text',
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh',
          type: 'password',
          autoComplete: 'new-password',
        },
        {
          name: 'referenceCode',
          labelKey: 'auth.register.referenceCode',
          placeholderKey: 'auth.register.referenceCodePh',
          type: 'text',
          required: false,
        },
      ],
    },
  },

  supplier: {
    id: 'supplier',
    layout: 'marketing',
    shortNameKey: 'auth.demo.supplier',
    login: {
      titleKey: 'auth.marketing.supplier.loginTitle',
      subtitleKey: 'auth.marketing.supplier.loginSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.supplier.loginSidebarTitle',
        subtitleKey: 'auth.marketing.supplier.loginSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.supplier.f1Title',
            descKey: 'auth.marketing.supplier.f1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.supplier.f2Title',
            descKey: 'auth.marketing.supplier.f2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.supplier.f3Title',
            descKey: 'auth.marketing.supplier.f3Desc',
          },
        ],
      },
    },
    register: {
      titleKey: 'auth.marketing.supplier.registerTitle',
      subtitleKey: 'auth.marketing.supplier.registerSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.supplier.regSidebarTitle',
        subtitleKey: 'auth.marketing.supplier.regSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.supplier.rf1Title',
            descKey: 'auth.marketing.supplier.rf1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.supplier.rf2Title',
            descKey: 'auth.marketing.supplier.rf2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.supplier.rf3Title',
            descKey: 'auth.marketing.supplier.rf3Desc',
          },
        ],
      },
      fields: [
        {
          name: 'companyName',
          labelKey: 'auth.register.companyName',
          placeholderKey: 'auth.register.companyNamePh2',
          type: 'text',
        },
        {
          name: 'email',
          labelKey: 'auth.email',
          placeholderKey: 'auth.register.emailPh2',
          type: 'email',
        },
        {
          name: 'phone',
          labelKey: 'auth.register.phone',
          placeholderKey: 'auth.register.phonePh',
          type: 'tel',
        },
        {
          name: 'companyCertificate',
          labelKey: 'auth.register.uploadCompanyCert',
          type: 'file',
        },
        {
          name: 'rcbe',
          labelKey: 'auth.register.uploadRcbe',
          type: 'file',
        },
        {
          name: 'iban',
          labelKey: 'auth.register.iban',
          placeholderKey: 'auth.register.ibanPh',
          type: 'text',
        },
        {
          name: 'ibanProof',
          labelKey: 'auth.register.uploadIbanProof',
          type: 'file',
          hideLabel: true,
        },
        {
          name: 'idDocuments',
          labelKey: 'auth.register.uploadIdDocs',
          type: 'file',
        },
        {
          name: 'addressProof',
          labelKey: 'auth.register.uploadAddress',
          type: 'file',
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
        {
          name: 'confirmPassword',
          labelKey: 'auth.register.confirmPassword',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
      ],
    },
  },

  factory: {
    id: 'factory',
    layout: 'marketing',
    shortNameKey: 'auth.demo.factory',
    login: {
      titleKey: 'auth.marketing.factory.loginTitle',
      subtitleKey: 'auth.marketing.factory.loginSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.factory.loginSidebarTitle',
        subtitleKey: 'auth.marketing.factory.loginSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.factory.f1Title',
            descKey: 'auth.marketing.factory.f1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.factory.f2Title',
            descKey: 'auth.marketing.factory.f2Desc',
          },
          {
            Icon: FiShield,
            titleKey: 'auth.marketing.factory.f3Title',
            descKey: 'auth.marketing.factory.f3Desc',
          },
        ],
      },
    },
    register: {
      titleKey: 'auth.marketing.factory.registerTitle',
      subtitleKey: 'auth.marketing.factory.registerSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.factory.regSidebarTitle',
        subtitleKey: 'auth.marketing.factory.regSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.factory.rf1Title',
            descKey: 'auth.marketing.factory.rf1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.factory.rf2Title',
            descKey: 'auth.marketing.factory.rf2Desc',
          },
          {
            Icon: FiShield,
            titleKey: 'auth.marketing.factory.rf3Title',
            descKey: 'auth.marketing.factory.rf3Desc',
          },
        ],
      },
      fields: [
        {
          name: 'factoryName',
          labelKey: 'auth.register.factoryName',
          placeholderKey: 'auth.register.companyNamePh2',
          type: 'text',
        },
        {
          name: 'email',
          labelKey: 'auth.email',
          placeholderKey: 'auth.register.emailPh2',
          type: 'email',
        },
        {
          name: 'phone',
          labelKey: 'auth.register.phone',
          placeholderKey: 'auth.register.phonePh',
          type: 'tel',
        },
        {
          name: 'factoryCertificate',
          labelKey: 'auth.register.uploadFactoryCert',
          type: 'file',
        },
        {
          name: 'rcbe',
          labelKey: 'auth.register.uploadRcbe',
          type: 'file',
        },
        {
          name: 'iban',
          labelKey: 'auth.register.iban',
          placeholderKey: 'auth.register.ibanPhFactory',
          type: 'text',
        },
        {
          name: 'ibanProof',
          labelKey: 'auth.register.uploadIbanProof',
          type: 'file',
          hideLabel: true,
        },
        {
          name: 'idDocuments',
          labelKey: 'auth.register.uploadIdDocs',
          type: 'file',
        },
        {
          name: 'addressProof',
          labelKey: 'auth.register.uploadAddressFactory',
          type: 'file',
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
        {
          name: 'confirmPassword',
          labelKey: 'auth.register.confirmPassword',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
      ],
    },
  },

  transporter: {
    id: 'transporter',
    layout: 'marketing',
    shortNameKey: 'auth.demo.transporter',
    login: {
      titleKey: 'auth.marketing.transporter.loginTitle',
      subtitleKey: 'auth.marketing.transporter.loginSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.transporter.loginSidebarTitle',
        subtitleKey: 'auth.marketing.transporter.loginSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.transporter.f1Title',
            descKey: 'auth.marketing.transporter.f1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.transporter.f2Title',
            descKey: 'auth.marketing.transporter.f2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.transporter.f3Title',
            descKey: 'auth.marketing.transporter.f3Desc',
          },
        ],
      },
    },
    register: {
      titleKey: 'auth.marketing.transporter.registerTitle',
      subtitleKey: 'auth.marketing.transporter.registerSubtitle',
      sidebar: {
        titleKey: 'auth.marketing.transporter.regSidebarTitle',
        subtitleKey: 'auth.marketing.transporter.regSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.transporter.rf1Title',
            descKey: 'auth.marketing.transporter.rf1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.transporter.rf2Title',
            descKey: 'auth.marketing.transporter.rf2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.transporter.rf3Title',
            descKey: 'auth.marketing.transporter.rf3Desc',
          },
        ],
      },
      fields: [
        {
          name: 'fullName',
          labelKey: 'auth.register.name',
          placeholderKey: 'auth.register.namePh',
          type: 'text',
          autoComplete: 'name',
        },
        {
          name: 'email',
          labelKey: 'auth.email',
          placeholderKey: 'auth.register.emailPh2',
          type: 'email',
        },
        {
          name: 'phone',
          labelKey: 'auth.register.phone',
          placeholderKey: 'auth.register.phonePh',
          type: 'tel',
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
        {
          name: 'confirmPassword',
          labelKey: 'auth.register.confirmPassword',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
        {
          name: 'iban',
          labelKey: 'auth.register.iban',
          placeholderKey: 'auth.register.ibanPhFactory',
          type: 'text',
        },
        {
          name: 'ibanProof',
          labelKey: 'auth.register.uploadIbanProof',
          type: 'file',
          hideLabel: true,
        },
        {
          name: 'civilLiability',
          labelKey: 'auth.register.uploadCivilLiability',
          type: 'file',
        },
        {
          name: 'transporterCivilLiability',
          labelKey: 'auth.register.uploadTransporterInsurance',
          type: 'file',
        },
      ],
    },
  },

  affiliate: {
    id: 'affiliate',
    layout: 'marketing',
    shortNameKey: 'auth.demo.affiliate',
    login: {
      titleKey: 'auth.marketing.affiliate.loginTitle',
      subtitleKey: 'auth.marketing.affiliate.loginSubtitle',
      submitKey: 'auth.marketing.affiliate.loginSubmit',
      showRememberMe: true,
      showLegal: true,
      forgotBesideLabel: true,
      sidebar: {
        brandKey: 'auth.marketing.affiliate.brand',
        BrandIcon: FiTrendingUp,
        titleKey: 'auth.marketing.affiliate.loginSidebarTitle',
        subtitleKey: 'auth.marketing.affiliate.loginSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.affiliate.f1Title',
            descKey: 'auth.marketing.affiliate.f1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.affiliate.f2Title',
            descKey: 'auth.marketing.affiliate.f2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.affiliate.f3Title',
            descKey: 'auth.marketing.affiliate.f3Desc',
          },
        ],
      },
    },
    register: {
      titleKey: 'auth.marketing.affiliate.registerTitle',
      subtitleKey: 'auth.marketing.affiliate.registerSubtitle',
      submitKey: 'auth.marketing.affiliate.registerSubmit',
      showLegal: true,
      sidebar: {
        brandKey: 'auth.marketing.affiliate.brand',
        BrandIcon: FiTrendingUp,
        titleKey: 'auth.marketing.affiliate.loginSidebarTitle',
        subtitleKey: 'auth.marketing.affiliate.loginSidebarSubtitle',
        features: [
          {
            Icon: FiDollarSign,
            titleKey: 'auth.marketing.affiliate.f1Title',
            descKey: 'auth.marketing.affiliate.f1Desc',
          },
          {
            Icon: FiShare2,
            titleKey: 'auth.marketing.affiliate.f2Title',
            descKey: 'auth.marketing.affiliate.f2Desc',
          },
          {
            Icon: FiClock,
            titleKey: 'auth.marketing.affiliate.f3Title',
            descKey: 'auth.marketing.affiliate.f3Desc',
          },
        ],
      },
      fields: [
        {
          name: 'fullName',
          labelKey: 'auth.register.fullName',
          placeholderKey: 'auth.register.fullNamePh',
          type: 'text',
          autoComplete: 'name',
        },
        {
          name: 'phone',
          labelKey: 'auth.register.phoneNumber',
          placeholderKey: 'auth.register.phonePh',
          type: 'tel',
          row: 'contact',
        },
        {
          name: 'email',
          labelKey: 'auth.email',
          placeholderKey: 'auth.register.emailPh2',
          type: 'email',
          row: 'contact',
        },
        {
          name: 'affiliateCode',
          labelKey: 'auth.register.affiliateCode',
          placeholderKey: 'auth.register.affiliateCodePh',
          type: 'text',
          required: false,
        },
        {
          name: 'password',
          labelKey: 'auth.password',
          placeholderKey: 'auth.register.passwordPh2',
          type: 'password',
        },
        {
          name: 'iban',
          labelKey: 'auth.register.iban',
          placeholderKey: 'auth.register.ibanPhFactory',
          type: 'text',
        },
        {
          name: 'ibanProof',
          labelKey: 'auth.register.uploadIbanProof',
          type: 'file',
          hideLabel: true,
        },
      ],
    },
  },
}

export const AUTH_ROLE_IDS = Object.keys(ROLE_AUTH)

export function getRoleAuthConfig(role) {
  return ROLE_AUTH[role] || null
}

export function isMarketingAuthRole(role) {
  const cfg = getRoleAuthConfig(role)
  return cfg?.layout === 'marketing'
}

export default ROLE_AUTH
