// 全 App 共用的狀態：客戶、待辦、錄音同意、標籤驗證、詞庫、CRM、新手引導
// 任何頁面都用 useCustomers() 拿資料和操作函式
import { createContext, useContext, useState } from 'react';
import {
  initialConsents,
  initialCustomers,
  initialTodos,
  initialVocabulary,
} from '../data/mockData';

const CustomerContext = createContext(null);

// 產生「2026/10/05 14:18」格式的時間
function nowText() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [todos, setTodos] = useState(initialTodos);
  const [consents, setConsents] = useState(initialConsents);
  const [activeSession, setActiveSession] = useState(null); // 進行中的錄音 { customerId, consentId, consentTime }
  const [tagReviews, setTagReviews] = useState({}); // { 標籤id: { status: 'confirmed' | 'edited', value } }
  const [vocabulary, setVocabulary] = useState(initialVocabulary);
  const [crm, setCrm] = useState({ system: '原廠 DMS', lastSync: '尚未同步' });
  const [onboarded, setOnboarded] = useState(false);

  // ---- 客戶 ----
  function addCustomer(customer) {
    const newCustomer = {
      id: 'c' + Date.now(),
      stage: '初次接觸',
      closeProbability: 20,
      lastContactDays: 0,
      ...customer,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  }
  function getCustomer(id) {
    return customers.find((c) => c.id === id);
  }

  // ---- 待辦 ----
  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // ---- 錄音同意 + 錄音工作階段 ----
  function giveConsentAndStart(customerId, method) {
    const customer = getCustomer(customerId);
    const record = {
      id: 'cs' + Date.now(),
      customerId,
      customerName: customer ? customer.name : '',
      time: nowText(),
      method,
      status: 'active',
    };
    setConsents((prev) => [record, ...prev]);
    setActiveSession({ customerId, consentId: record.id, consentTime: record.time });
  }
  function endSession() {
    setActiveSession(null);
  }
  function revokeConsent(id) {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'revoked' } : c)));
  }

  // ---- AI 標籤驗證 ----
  function reviewTag(tagId, status, value) {
    setTagReviews((prev) => ({ ...prev, [tagId]: { status, value } }));
  }

  // ---- 專有名詞詞庫 ----
  function addTerm(term) {
    const t = term.trim();
    if (!t || vocabulary.includes(t)) return false;
    setVocabulary((prev) => [t, ...prev]);
    return true;
  }
  function removeTerm(term) {
    setVocabulary((prev) => prev.filter((v) => v !== term));
  }

  // ---- CRM ----
  function chooseCrm(system) {
    setCrm((prev) => ({ ...prev, system }));
  }
  function syncCrm() {
    setCrm((prev) => ({ ...prev, lastSync: nowText() }));
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        getCustomer,
        todos,
        toggleTodo,
        consents,
        activeSession,
        giveConsentAndStart,
        endSession,
        revokeConsent,
        tagReviews,
        reviewTag,
        vocabulary,
        addTerm,
        removeTerm,
        crm,
        chooseCrm,
        syncCrm,
        onboarded,
        setOnboarded,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  return useContext(CustomerContext);
}
