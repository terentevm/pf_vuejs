export default {
  sideNav: {
    references: [
      {
        key: 'ref_currencies_id',
        icon: 'fas fa-euro-sign text-secondary',
        name: 'Currencies',
        path: '/currencies',

      },
      {
        key: 'ref_wallets_id',
        icon: 'fas fa-wallet text-secondary',
        name: 'Wallets',
        path: '/wallets',

      },
      {
        key: 'ref_items_income_id',
        icon: 'fas fa-tasks text-secondary',
        name: 'Income items',
        path: '/itemsincome',

      },
      {
        key: 'ref_items_expense_id',
        icon: 'fas fa-tasks text-secondary',
        name: 'Expense items',
        path: '/itemsexpenditure',

      },
      {
        key: 'ref_items_contacts_id',
        icon: 'far fa-address-book text-secondary',
        name: 'Contacts',
        path: '/contacts',
      },
    ],
    transactions: [
      {key: 'doc_expenses_id', icon: 'fab fa-cc-amazon-pay text-secondary', name: 'Expenses', path: '/expends'},
      {key:'doc_incomes_id', icon: 'fas fa-hand-holding-usd text-secondary', name: 'Incomes', path: '/incomes'},
      {
        key: 'doc_transfers_id',
        icon: 'fas fa-exchange-alt text-secondary',
        name: 'Transfers',
        path: '/transfers'
      },
    ],
    other: [
      {icon: 'settings text-secondary', name: 'Settings', path: '/settings'}
    ]
  }
}