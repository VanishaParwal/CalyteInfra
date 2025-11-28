import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Assessment from "@/pages/assessment";
import Meditation from "@/pages/meditation";
import Goals from "@/pages/goals";
import Sessions from "@/pages/sessions";
import Circles from "@/pages/circles";
import CircleDetail from "@/pages/circle-detail";
import Streaks from "@/pages/streaks";
import Playlist from "@/pages/playlist";
import Chat from "@/pages/chat";
import Games from "@/pages/games";
import Journal from "@/pages/journal";

function Router() {
  return (
    <Switch>
      {/* Main Pages */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      
      {/* Features */}
      <Route path="/assessment" component={Assessment} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/goals" component={Goals} />
      <Route path="/sessions" component={Sessions} />
      <Route path="/streaks" component={Streaks} />
      <Route path="/playlist" component={Playlist} />
      <Route path="/chat" component={Chat} />
      <Route path="/games" component={Games} />
      <Route path="/journal" component={Journal} />

      {/* Community */}
      <Route path="/circles" component={Circles} />
      <Route path="/circles/:id" component={CircleDetail} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;