// 讓「客戶清單」在不同頁面之間共用：
// 新增客戶頁加了一筆，客戶總覽頁馬上看得到
import { createContext, useContext, useState } from 'react';
import { initialCustomers } from '../data/mockData';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(initialCustomers);

  function addCustomer(customer) {
    const newCustomer = { id: 'c' + Date.now(), ...customer };
    setCustomers((prev) => [newCustomer, ...prev]); // 新客戶放最上面
    return newCustomer;
  }

  return (
    <CustomerContext.Provider value={{ customers, addCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  return useContext(CustomerContext);
}
