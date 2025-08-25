import React from 'react';
import StickyHeadTable from '../components/ExpensesList/ExpensesList';
import ExpensesForm from '../components/ExpensesForm/ExpensesForm';

const ExpensesPage = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleExpenseCreated = () => {
    // Incrementar el key para forzar refresh de la lista
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <ExpensesForm onExpenseCreated={handleExpenseCreated} />
      <StickyHeadTable refreshKey={refreshKey} />
    </>
  );
}

export default ExpensesPage;