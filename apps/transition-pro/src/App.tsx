import { AppRouter } from "./app/router";
import { AppProviders } from "@/app/provider";

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
