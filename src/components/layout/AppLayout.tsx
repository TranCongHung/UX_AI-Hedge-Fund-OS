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
          "flex flex-col flex-1 h-full transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-56" : "md:ml-16",
          rightPanelOpen ? "lg:mr-80" : "mr-0"
        )}
      >
        <TopNav />
        {/* We add pb-8 here to clear the status bar height */}
        <main className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar pb-10">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <RightAssistant />
      <StatusBar />
    </div>
  );
}
