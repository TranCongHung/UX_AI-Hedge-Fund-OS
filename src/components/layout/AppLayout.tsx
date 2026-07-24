import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 h-full transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-56" : "md:ml-16"
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
