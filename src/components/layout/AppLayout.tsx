import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import StatusBar from './StatusBar';
import RightAssistant from './RightAssistant';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const { sidebarOpen, rightPanelOpen } = useAppStore();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 h-full transition-all duration-200 ease-in-out",
          sidebarOpen ? "md:ml-60" : "md:ml-14",
          rightPanelOpen ? "lg:mr-80" : "mr-0"
        )}
      >
        <TopNav />
        {/* Main Content Area: Use 8px spacing based padding (p-4 = 16px, p-6 = 24px) */}
        <main className="flex-1 overflow-y-auto scrollbar-none bg-background/50">
          <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 lg:p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <RightAssistant />
      <StatusBar />
    </div>
  );
}
