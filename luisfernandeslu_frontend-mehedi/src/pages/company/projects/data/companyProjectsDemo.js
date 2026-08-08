export const COMPANY_PROJECTS_LIST = [
  {
    id: 'downtown-commercial',
    name: 'Harbor Bridge Construction',
    address: '456 Harbor Rd, Waterfront',
    categoryLabel: 'Construction Materials',
  },
  {
    id: 'riverside-tower',
    name: 'Harbor Bridge Construction',
    address: '456 Harbor Rd, Waterfront',
    categoryLabel: 'Construction Materials',
  },
  {
    id: 'metro-fitout',
    name: 'Harbor Bridge Construction',
    address: '456 Harbor Rd, Waterfront',
    categoryLabel: 'Construction Materials',
  },
  {
    id: 'greenfield-plant',
    name: 'Harbor Bridge Construction',
    address: '456 Harbor Rd, Waterfront',
    categoryLabel: 'Construction Materials',
  },
]

const MATERIAL_ROWS = [
  {
    id: 'cement-grade-53',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$25,000',
    duePayment: '$3,500',
  },
  {
    id: 'cement-grade-53-b',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$48,500',
    duePayment: '$15,000',
  },
  {
    id: 'cement-grade-53-c',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$72,000',
    duePayment: '$8,200',
  },
  {
    id: 'cement-grade-53-d',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$96,000',
    duePayment: '$0 (Fully Paid)',
  },
  {
    id: 'cement-grade-53-e',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$1,10,000',
    duePayment: '$12,000',
  },
  {
    id: 'cement-grade-53-f',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$1,18,000',
    duePayment: '$21,300',
  },
  {
    id: 'cement-grade-53-g',
    materialName: 'Cement (Grade 53)',
    orderedQuantity: '4,500 bags',
    deliveredValue: '$1,25,000',
    duePayment: '$0 (Fully Paid)',
  },
]

export const COMPANY_PROJECT_DETAIL = {
  id: 'downtown-commercial',
  name: 'Downtown Commercial Complex',
  location: 'Mumbai, Maharashtra',
  materialTypes: '45',
  deliveredValue: '$1,25,00,000',
  duePayment: '$60,00,000',
  materials: MATERIAL_ROWS,
}

export const COMPANY_MATERIAL_DETAIL = {
  id: 'cement-grade-53',
  materialName: 'Cement (Grade 53)',
  reminder: {
    title: 'Upcoming Payment Reminder',
    body: 'Your next installment of $8,333 is due on May 15, 2026.',
  },
  orderId: '#ORD-2026-4521',
  planLabel: '10 Months Plan',
  planRange: 'Feb 15, 2026 - Dec 15, 2026',
  supplierName: 'BuildTech Construction Co.',
  projectName: 'Downtown Plaza Development',
  totalOrderValue: '$50,000',
  paymentSummary: {
    totalAmount: '$50,000',
    paidAmount: '$16,666',
    remainingBalance: '$33,334',
    progressPercent: 33,
    progressLabel: '33% Completed',
    nextInstallmentDate: 'May 15, 2026',
    monthlyPayment: '$8,333',
  },
  installments: [
    {
      id: '1',
      title: '1st Installment',
      status: 'completed',
      dueDate: 'Mar 15, 2026',
      amount: '$8,333',
      quantity: '30 bags',
    },
    {
      id: '2',
      title: '2nd Installment',
      status: 'completed',
      dueDate: 'Apr 15, 2026',
      amount: '$8,333',
      quantity: '30 bags',
    },
    {
      id: '3',
      title: '3rd Installment',
      status: 'pending',
      dueDate: 'May 15, 2026',
      amount: '$8,333',
      quantity: '30 bags',
      canPayNow: true,
    },
    {
      id: '4',
      title: '4th Installment',
      status: 'pending',
      dueDate: 'Jun 15, 2026',
      amount: '$8,333',
      quantity: '30 bags',
      canPayNow: true,
    },
    {
      id: '5',
      title: '5th Installment',
      status: 'pending',
      dueDate: 'Jul 15, 2026',
      amount: '$8,333',
      quantity: '30 bags',
      canPayNow: true,
    },
    {
      id: '6',
      title: '6th Installment',
      status: 'pending',
      dueDate: 'Aug 15, 2026',
      amount: '$8,335',
      quantity: '30 bags',
      canPayNow: true,
    },
  ],
}

export function getCompanyProject(projectId) {
  if (projectId === COMPANY_PROJECT_DETAIL.id) {
    return COMPANY_PROJECT_DETAIL
  }
  const card = COMPANY_PROJECTS_LIST.find((item) => item.id === projectId)
  if (!card) return null
  return {
    ...COMPANY_PROJECT_DETAIL,
    id: card.id,
    name: card.name,
    location: card.address,
  }
}

export function getCompanyMaterialDetail(projectId, materialId) {
  const project = getCompanyProject(projectId)
  if (!project) return null
  const material = project.materials.find((row) => row.id === materialId)
  if (!material) return null
  return {
    ...COMPANY_MATERIAL_DETAIL,
    id: material.id,
    materialName: material.materialName,
    projectId: project.id,
  }
}
