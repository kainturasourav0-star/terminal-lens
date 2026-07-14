import { create } from 'zustand';

let tabIdCounter = 1;

const createTab = (url = 'about:blank', title = 'New Tab') => ({
    id: tabIdCounter++,
    url,
    title,
    favicon: null,
    isLoading: false,
    canGoBack: false,
    canGoForward: false,
});

export const useTabStore = create((set, get) => ({
    tabs: [createTab('about:blank', 'New Tab')],
    activeTabId: 1,
    sidebarOpen: false,
    sidebarContent: null,
    sidebarLoading: false,

    // Tab operations
    addTab: (url = 'about:blank') => {
        const tab = createTab(url);
        set((state) => ({
            tabs: [...state.tabs, tab],
            activeTabId: tab.id,
        }));
        return tab.id;
    },

    closeTab: (id) => {
        set((state) => {
            const tabs = state.tabs.filter((t) => t.id !== id);
            if (tabs.length === 0) {
                const newTab = createTab();
                return { tabs: [newTab], activeTabId: newTab.id };
            }
            const activeId = state.activeTabId === id
                ? tabs[tabs.length - 1].id
                : state.activeTabId;
            return { tabs, activeTabId: activeId };
        });
    },

    setActiveTab: (id) => set({ activeTabId: id }),

    updateTab: (id, updates) => {
        set((state) => ({
            tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
    },

    reorderTabs: (fromIndex, toIndex) => {
        set((state) => {
            const tabs = [...state.tabs];
            const [moved] = tabs.splice(fromIndex, 1);
            tabs.splice(toIndex, 0, moved);
            return { tabs };
        });
    },

    getActiveTab: () => {
        const { tabs, activeTabId } = get();
        return tabs.find((t) => t.id === activeTabId) ?? tabs[0];
    },

    // Navigate active tab
    navigate: (url) => {
        const { activeTabId } = get();
        set((state) => ({
            tabs: state.tabs.map((t) =>
                t.id === activeTabId ? { ...t, url, isLoading: true } : t
            ),
        }));
    },

    // Sidebar
    openSidebar: (content) => set({ sidebarOpen: true, sidebarContent: content, sidebarLoading: false }),
    setSidebarLoading: (loading) => set({ sidebarLoading: loading, sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false, sidebarContent: null }),
}));
